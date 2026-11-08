"""Lifecycle contract, using isolated HA API doubles and real async scheduling."""

import asyncio
import importlib.util
from pathlib import Path
import sys
from types import ModuleType, SimpleNamespace
import unittest
from unittest.mock import AsyncMock, Mock


# Actual Home Assistant integration tests live in each consumer repository.
for name in (
    "homeassistant",
    "homeassistant.components",
    "homeassistant.components.frontend",
    "homeassistant.components.websocket_api",
    "homeassistant.components.http",
    "homeassistant.components.panel_custom",
    "homeassistant.core",
    "homeassistant.loader",
):
    sys.modules[name] = ModuleType(name)
frontend = sys.modules["homeassistant.components.frontend"]
frontend.DATA_PANELS = "frontend_panels"
frontend.add_extra_js_url = Mock()
frontend.remove_extra_js_url = Mock()
sys.modules["homeassistant.components.http"].StaticPathConfig = lambda *args, **kwargs: (
    args,
    kwargs,
)
sys.modules["homeassistant.components.panel_custom"].async_register_panel = AsyncMock()
sys.modules["homeassistant.core"].HomeAssistant = object
sys.modules["homeassistant.loader"].async_get_integration = AsyncMock()
spec = importlib.util.spec_from_file_location(
    "ha_plus_frontend", Path(__file__).parents[1] / "ha_plus_frontend/__init__.py"
)
shared = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = shared
spec.loader.exec_module(shared)


class FrontendTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.hass = SimpleNamespace(
            data={}, http=SimpleNamespace(async_register_static_paths=AsyncMock())
        )
        self.panels = {}
        self.hass.data[frontend.DATA_PANELS] = self.panels
        self.modules = set()
        self.version = "1.2.3"
        shared.async_get_integration = AsyncMock(
            side_effect=lambda *args: SimpleNamespace(version=self.version)
        )
        shared.add_extra_js_url = Mock(
            side_effect=lambda hass, url: self.modules.add(url)
        )
        shared.remove_extra_js_url = Mock(
            side_effect=lambda hass, url: self.modules.remove(url)
        )
        frontend.async_panel_exists = Mock(
            side_effect=lambda hass, path: path in self.panels
        )
        frontend.async_remove_panel = Mock(
            side_effect=lambda hass, path: self.panels.pop(path, None)
        )
        shared.websocket_api.async_register_command = Mock()

        async def register(hass, **kwargs):
            path = kwargs["frontend_url_path"]
            if path in self.panels:
                raise ValueError("Panel already exists")
            self.panels[path] = kwargs

        shared.async_register_panel = AsyncMock(side_effect=register)
        self.options = dict(
            domain="example",
            module_url="/example/panel.js",
            static_paths={
                "/example/panel.js": Path("/tmp/panel.js"),
                "/example/icon.js": Path("/tmp/icon.js"),
            },
            frontend_url_path="ha-plus-example",
            webcomponent_name="ha-plus-example-panel",
            sidebar_title="HA+ Example",
            sidebar_icon="example:logo",
            extra_js_urls=("/example/icon.js",),
        )

    async def register(self, **kwargs):
        await shared.async_register_frontend(self.hass, **{**self.options, **kwargs})

    async def test_concurrent_registration_is_idempotent_and_preserves_metadata(self):
        command = Mock()
        await asyncio.gather(
            *(self.register(commands=(command,), require_admin=True) for _ in range(4))
        )
        self.hass.http.async_register_static_paths.assert_awaited_once()
        shared.async_register_panel.assert_awaited_once()
        shared.websocket_api.async_register_command.assert_called_once_with(
            self.hass, command
        )
        self.assertEqual(
            [call.args[1] for call in shared.add_extra_js_url.call_args_list],
            [
                "/example/icon.js?v=1.2.3",
                "/example/panel.js?v=1.2.3",
            ],
        )
        panel = self.panels["ha-plus-example"]
        self.assertTrue(panel["require_admin"])
        self.assertEqual(panel["config"], {"version": "1.2.3"})
        self.assertEqual(panel["sidebar_icon"], "example:logo")
        for args, kwargs in self.hass.http.async_register_static_paths.call_args.args[
            0
        ]:
            self.assertFalse(kwargs["cache_headers"])

    async def test_unload_reload_restores_panel_without_registering_assets_again(self):
        await self.register()
        shared.async_unregister_frontend(self.hass, "ha-plus-example")
        await self.register()
        self.assertEqual(shared.async_register_panel.await_count, 2)
        self.hass.http.async_register_static_paths.assert_awaited_once()
        self.assertEqual(shared.add_extra_js_url.call_count, 2)
        self.assertIn("ha-plus-example", self.panels)

    async def test_version_change_replaces_old_modules_and_refreshes_panel(self):
        await self.register()
        self.version = "1.2.4+build 2"
        await self.register()
        self.assertEqual(
            self.modules,
            {
                "/example/icon.js?v=1.2.4%2Bbuild%202",
                "/example/panel.js?v=1.2.4%2Bbuild%202",
            },
        )
        self.assertEqual(
            self.panels["ha-plus-example"]["config"], {"version": self.version}
        )
        self.hass.http.async_register_static_paths.assert_awaited_once()

    async def test_failed_panel_registration_retries_without_duplicate_routes(self):
        register = shared.async_register_panel.side_effect
        shared.async_register_panel.side_effect = RuntimeError("Panel unavailable")
        with self.assertRaisesRegex(RuntimeError, "Panel unavailable"):
            await self.register()
        shared.async_register_panel.side_effect = register
        await self.register()
        self.hass.http.async_register_static_paths.assert_awaited_once()
        self.assertIn("ha-plus-example", self.panels)

    async def test_command_failure_retains_successful_registration_stages(self):
        first, second = Mock(), Mock()
        shared.websocket_api.async_register_command.side_effect = [
            None,
            RuntimeError("Command unavailable"),
        ]
        with self.assertRaisesRegex(RuntimeError, "Command unavailable"):
            await self.register(commands=(first, second))
        shared.websocket_api.async_register_command.side_effect = None
        await self.register(commands=(first, second))
        self.assertEqual(
            [
                call.args[1]
                for call in shared.websocket_api.async_register_command.call_args_list
            ],
            [first, second, second],
        )
        self.hass.http.async_register_static_paths.assert_awaited_once()

    async def test_failed_route_registration_can_be_retried(self):
        self.hass.http.async_register_static_paths.side_effect = RuntimeError(
            "HTTP unavailable"
        )
        with self.assertRaisesRegex(RuntimeError, "HTTP unavailable"):
            await self.register()
        self.hass.http.async_register_static_paths.side_effect = None
        await self.register()
        self.assertEqual(self.hass.http.async_register_static_paths.await_count, 2)

    async def test_integrations_have_independent_lifecycles_and_permissions(self):
        await self.register()
        await self.register(
            domain="private", frontend_url_path="ha-plus-private", require_admin=True
        )
        self.assertFalse(self.panels["ha-plus-example"]["require_admin"])
        self.assertTrue(self.panels["ha-plus-private"]["require_admin"])
        self.assertEqual(self.hass.http.async_register_static_paths.await_count, 2)

    async def test_foreign_panel_is_never_removed(self):
        self.panels["ha-plus-example"] = {"owner": "foreign"}
        with self.assertRaisesRegex(ValueError, "Panel already exists"):
            await self.register()
        frontend.async_remove_panel.assert_not_called()
        self.assertEqual(self.panels["ha-plus-example"], {"owner": "foreign"})
