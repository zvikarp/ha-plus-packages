import { nativeForm } from "./native.js";
import { localize } from "./localize.js";
import messages from "./translations/en.json" with { type: "json" };

// Load HA's own lazily registered controls when this panel is opened directly.
let nativeComponents;

export async function loadNativeComponents(host) {
  const required = ["ha-form", "ha-checkbox", "ha-dialog", "ha-icon-button"];
  if (required.every((name) => customElements.get(name))) return;
  if (!nativeComponents) {
    nativeComponents = (async () => {
      if (!window.loadCardHelpers) {
        // Reuse the owning HA router's dashboard loader without navigating or
        // constructing a second dashboard. Its bundle exposes loadCardHelpers.
        let resolver = host;
        while (resolver && resolver.localName !== "partial-panel-resolver") {
          resolver = resolver.parentElement || resolver.getRootNode().host;
        }
        const dashboard = Object.values(resolver?.routerOptions?.routes || {})
          .find((route) => route.tag === "ha-panel-lovelace");
        if (!dashboard?.load) {
          throw new Error(localize(host._hass, messages, "dashboard_load_failed"));
        }
        await dashboard.load();
      }
      const helpers = await window.loadCardHelpers();
      const entities = helpers.createCardElement({ type: "entities", entities: [] });
      await entities.constructor.getConfigElement();
      helpers.createCardElement({ type: "todo-list", entity: "todo.ha_plus_ui" });
      let loadingTimeout;
      try {
        await Promise.race([
          customElements.whenDefined("hui-todo-list-card"),
          new Promise((_, reject) => {
            loadingTimeout = setTimeout(() => reject(new Error(localize(host._hass, messages, "controls_load_failed"))), 15000);
          }),
        ]);
      } finally {
        clearTimeout(loadingTimeout);
      }
      for (const name of required) {
        if (!customElements.get(name)) {
          throw new Error(localize(host._hass, messages, "component_load_failed", { component: name }));
        }
      }
    })().catch((error) => {
      nativeComponents = undefined;
      throw error;
    });
  }
  await nativeComponents;
}


/** HA's number selector imports the supported native slider for its version. */
export async function loadNativeSlider(host) {
  await loadNativeComponents(host);
  if (customElements.get("ha-slider")) return;
  const bootstrap = nativeForm(host._hass, [{
    name: "value", label: "", selector: { number: { min: 0, max: 100, mode: "slider" } },
  }], { value: 0 }, () => {});
  bootstrap.hidden = true;
  host.shadowRoot.append(bootstrap);
  let timeout;
  try {
    await Promise.race([
      customElements.whenDefined("ha-slider"),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(localize(host._hass, messages, "component_load_failed", { component: "ha-slider" }))), 15000);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
    bootstrap.remove();
  }
}
