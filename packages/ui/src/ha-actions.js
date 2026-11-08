import { localize } from "./localize.js";
import { haContext } from "./preferences.js";

import { el } from "./dom.js";
import { iconButton } from "./native.js";

export function showMoreInfo(host, entityId) {
  if (!/^[a-z_]+\.[a-z0-9_]+$/.test(entityId || "")) return false;
  const root = host || (() => {
    try { return window.parent.document.querySelector("home-assistant"); } catch { return undefined; }
  })();
  if (!root) return false;
  const Event = root.ownerDocument.defaultView.CustomEvent;
  root.dispatchEvent(new Event("hass-more-info", { bubbles: true, composed: true, detail: { entityId } }));
  return true;
}

export function integrationUrl(domain, add = false) {
  if (!/^[a-z0-9_]+$/.test(domain)) throw new TypeError("Invalid integration domain");
  return add ? `/config/integrations/dashboard/add?domain=${domain}` : `/config/integrations/integration/${domain}`;
}

export function integrationLink(domain, label) {
  const link = el("a", label, "ha-plus-text-button");
  link.href = integrationUrl(domain);
  return link;
}

export function showToast(host, message) {
  if (!host) {
    try { host = window.parent.document.querySelector("home-assistant"); } catch { return false; }
  }
  if (!host) return false;
  const Event = host.ownerDocument.defaultView.CustomEvent;
  host.dispatchEvent(new Event("hass-notification", { bubbles: true, composed: true, detail: { message } }));
  return true;
}

/** HA's native menu button supplies keyboard, focus and mobile popover behavior. */
export function overflowMenu(actions, label = localize(haContext(), {}, "more_actions")) {
  const registry = document.defaultView?.customElements;
  if (registry?.get("ha-dropdown")) {
    const menu = el("ha-dropdown");
    const trigger = iconButton(label, "mdi:dots-vertical", () => {});
    trigger.slot = "trigger";
    menu.append(trigger);
    actions.forEach((action, index) => {
      const item = el("ha-dropdown-item", action.label);
      item.value = String(index);
      item.disabled = Boolean(action.disabled);
      menu.append(item);
    });
    menu.addEventListener("wa-select", event => {
      const action = actions[Number(event.detail?.item?.value)];
      if (action && !action.disabled) action.run();
    });
    return menu;
  }
  if (registry?.get("ha-button-menu")) {
    const menu = el("ha-button-menu");
    const trigger = iconButton(label, "mdi:dots-vertical", () => {});
    trigger.slot = "trigger";
    menu.append(trigger);
    for (const action of actions) {
      const item = el("mwc-list-item", action.label);
      item.disabled = Boolean(action.disabled);
      item.addEventListener("click", () => { if (!item.disabled) action.run(); });
      menu.append(item);
    }
    return menu;
  }
  const menu = el("details", undefined, "ha-plus-overflow");
  const trigger = el("summary", label);
  menu.append(trigger);
  for (const action of actions) {
    const item = el("button", action.label);
    item.type = "button";
    item.disabled = Boolean(action.disabled);
    item.addEventListener("click", () => { if (!item.disabled) { menu.open = false; action.run(); } });
    menu.append(item);
  }
  return menu;
}

export function setActionState(control, { busy = false, success = false } = {}) {
  control.disabled = busy || success;
  control.loading = busy;
  control.classList.toggle("success", success);
  if (control.localName === "ha-button") control.variant = success ? "success" : "brand";
  control.setAttribute("aria-busy", String(busy));
}

export function navigate(host, path) {
  if (!path.startsWith("/") || path.startsWith("//")) throw new TypeError("Navigation must stay within Home Assistant");
  const view = host?.ownerDocument.defaultView || window.parent;
  view.history.pushState(null, "", path);
  view.dispatchEvent(new view.CustomEvent("location-changed", { detail: { replace: false } }));
}
