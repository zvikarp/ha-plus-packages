import { nativeForm, nativeTextField, focusControl } from "./native.js";
/*! @ha-plus/ui v0.4.0-rc.3 | MIT | Copyright (c) 2026 HA+ contributors | https://github.com/zvikarp/ha-plus-packages/blob/main/LICENSE */
export { themeStyles, appStyles } from "./styles.js";

import { el, icon, button } from "./dom.js";
export { el, icon, button } from "./dom.js";

let nextId = 0;
/** Themed, keyboard-operable listbox: no platform-default select menus. */
export function dropdown(key, label, options, value, change, disabled, hass) {
  if (document.defaultView?.customElements.get("ha-form") && hass) {
    // HA's floating labels require a nonempty internal value, including for None.
    const selected = options.findIndex(option => option.value === value);
    const schema = [{
      name: "selected", label, required: true,
      selector: { select: { mode: "dropdown", options: options.map((option, index) => ({
        value: String(index), label: option.label,
      })) } },
    }];
    const form = nativeForm(hass, schema, { selected: selected < 0 ? undefined : String(selected) }, data => {
      const option = options.find((_, index) => String(index) === data.selected);
      if (option && !form.disabled) change(option.value);
    });
    form.disabled = Boolean(disabled);
    form.dataset.control = key;
    form.className = "field";
    return form;
  }
  const field = el("div", undefined, "field");
  const labelNode = el("span", label, "field-label");
  labelNode.id = `ha-plus-label-${++nextId}`;
  const trigger = button(undefined, () => setOpen(menu.hidden), disabled, "combobox");
  trigger.dataset.control = key;
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-labelledby", labelNode.id);
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.append(el("span", options.find(option => option.value === value)?.label || "Choose…"), icon("mdi:chevron-down"));
  const menu = el("div", undefined, "listbox");
  menu.id = `ha-plus-list-${nextId}`;
  menu.hidden = true;
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-labelledby", labelNode.id);
  trigger.setAttribute("aria-controls", menu.id);
  const choices = options.map(option => {
    const item = button(option.label, () => {
      setOpen(false);
      change(option.value);
    }, false, "option");
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(option.value === value));
    item.tabIndex = -1;
    menu.append(item);
    return item;
  });
  function setOpen(open) {
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open) choices[Math.max(0, options.findIndex(option => option.value === value))]?.focus();
    else trigger.focus();
  }
  field.addEventListener("keydown", event => {
    const index = choices.indexOf(event.target);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (menu.hidden) setOpen(true);
      else {
        let target = 0;
        if (event.key === "End") target = choices.length - 1;
        if (event.key === "ArrowDown") target = (index + 1) % choices.length;
        if (event.key === "ArrowUp") target = (index - 1 + choices.length) % choices.length;
        choices[target]?.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  });
  field.addEventListener("focusout", event => {
    if (!field.contains(event.relatedTarget)) {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }
  });
  field.append(labelNode, trigger, menu);
  return field;
}


/** A native labeled text field preserves form submission and browser validation. */
export function textField(label, { name, required = false, maxLength, disabled = false } = {}) {
  const registry = document.defaultView?.customElements;
  if (registry?.get("ha-input") || registry?.get("ha-textfield")) {
    const input = nativeTextField(label, "", () => {});
    if (name !== undefined) input.name = name;
    input.required = required;
    if (maxLength !== undefined) input.maxLength = maxLength;
    input.disabled = disabled;
    input.className = "field";
    return { field: input, input };
  }
  const field = el("label", undefined, "field");
  field.append(el("span", label, "field-label"));
  const input = el("input");
  input.type = "text";
  if (name !== undefined) input.name = name;
  input.required = required;
  if (maxLength !== undefined) input.maxLength = maxLength;
  input.disabled = disabled;
  input.autocomplete = "off";
  field.append(input);
  return { field, input };
}

/** HA owns its menu button, including sidebar behavior and narrow layouts. */
export function panelHeader(title, { hass, narrow, actions = [], subtitle } = {}) {
  const header = el("header", undefined, "ha-plus-header");
  const menu = el("ha-menu-button");
  menu.hass = hass;
  menu.narrow = narrow;
  const heading = el("div", undefined, "ha-plus-header-heading");
  heading.append(el("h1", title));
  if (subtitle) heading.append(el("p", subtitle, "ha-plus-muted"));
  header.append(menu, heading, ...actions);
  return header;
}

export function notice(message, kind = "status") {
  if (!["status", "loading", "empty", "error"].includes(kind)) {
    throw new TypeError("Unknown notice kind");
  }
  const native = Boolean(document.defaultView?.customElements.get("ha-alert"));
  const node = el(native ? "ha-alert" : "div", message, kind === "error" ? "notice error" : "notice");
  if (native) node.setAttribute("alert-type", kind === "error" ? "error" : "info");
  node.setAttribute("role", kind === "error" ? "alert" : "status");
  node.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
  if (kind === "loading") node.setAttribute("aria-busy", "true");
  return node;
}

/** Native modal provides focus trapping, Escape handling and focus restoration. */
export function confirmDialog(host, { title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", returnFocus = host.shadowRoot.activeElement }) {
  if (document.defaultView?.customElements.get("ha-dialog")) {
    return nativeConfirmation(host, { title, message, confirmLabel, cancelLabel, returnFocus });
  }
  const dialog = el("dialog");
  const id = `ha-plus-dialog-${++nextId}`;
  const heading = el("h2", title);
  heading.id = `${id}-title`;
  const description = el("p", message);
  description.id = `${id}-description`;
  dialog.setAttribute("aria-labelledby", heading.id);
  dialog.setAttribute("aria-describedby", description.id);
  const form = el("form");
  form.method = "dialog";
  const cancel = el("button", cancelLabel);
  cancel.type = "submit";
  cancel.value = "cancel";
  cancel.autofocus = true;
  const confirm = el("button", confirmLabel, "primary");
  confirm.type = "submit";
  confirm.value = "confirm";
  form.append(cancel, confirm);
  dialog.append(heading, description, form);
  host.shadowRoot.append(dialog);
  return new Promise((resolve, reject) => {
    dialog.addEventListener("close", () => {
      const confirmed = dialog.returnValue === "confirm";
      dialog.remove();
      resolve(confirmed);
      Promise.resolve().then(() => focusControl(returnFocus));
    }, { once:true });
    try {
      dialog.showModal();
    } catch (error) {
      dialog.remove();
      reject(error);
    }
  });
}

export { collectionStyles } from "./collections.js";
export { controlStyles, colorSwatch } from "./controls.js";
export { actionButton, iconButton, nativeTextField, nativeForm, nativeSlider, focusControl } from "./native.js";

export { iframePanelStyles } from "./iframe-panel.js";

export { loadNativeComponents, loadNativeSlider } from "./loader.js";
export { preferences, applyPreferences, haContext, formatNumber, formatDateTime, formatEntityState, relativeCalendarDate } from "./preferences.js";
export { localize, createLocalizer, localizeSchema } from "./localize.js";
export { showMoreInfo, integrationUrl, integrationLink, showToast, overflowMenu, setActionState, navigate } from "./ha-actions.js";

function nativeConfirmation(host, { title, message, confirmLabel, cancelLabel, returnFocus }) {
  const dialog = el("ha-dialog");
  const modern = "headerTitle" in dialog;
  dialog.heading = title;
  dialog.headerTitle = title;
  dialog.setAttribute("header-title", title);
  const content = el("p", message, "ha-plus-dialog-message");
  dialog.append(content);
  return new Promise(resolve => {
    let settled = false;
    const finish = confirmed => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      dialog.open = false;
      dialog.remove();
      resolve(confirmed);
      Promise.resolve().then(() => focusControl(returnFocus));
    };
    const observer = new host.ownerDocument.defaultView.MutationObserver(() => {
      if (!host.shadowRoot.contains(dialog) || (connected && !host.isConnected)) finish(false);
    });
    const connected = host.isConnected;
    observer.observe(host.shadowRoot, { childList: true });
    if (connected) observer.observe(host.ownerDocument, { childList: true, subtree: true });
    const cancel = button(cancelLabel, () => finish(false));
    cancel.setAttribute("autofocus", "");
    const confirm = button(confirmLabel, () => finish(true), false, "primary");
    if (modern) {
      const footer = el("div", undefined, "ha-plus-dialog-actions");
      footer.slot = "footer";
      footer.append(cancel, confirm);
      dialog.append(footer);
    } else {
      cancel.slot = "secondaryAction";
      confirm.slot = "primaryAction";
      dialog.append(cancel, confirm);
    }
    dialog.addEventListener("closed", () => finish(false));
    host.shadowRoot.append(dialog);
    dialog.open = true;
    Promise.resolve(dialog.updateComplete).then(() => { if (!settled) focusControl(cancel); });
  });
}
