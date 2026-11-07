/*! @ha-plus/ui v0.3.0 | MIT | Copyright (c) 2026 HA+ contributors | https://github.com/zvikarp/ha-plus-packages/blob/main/LICENSE */
export { themeStyles, appStyles } from "./styles.js";

import { el, icon, button } from "./dom.js";
export { el, icon, button } from "./dom.js";

let nextId = 0;
/** Themed, keyboard-operable listbox: no platform-default select menus. */
export function dropdown(key, label, options, value, change, disabled) {
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
export function panelHeader(title, { hass, narrow, actions = [] } = {}) {
  const header = el("header", undefined, "ha-plus-header");
  const menu = el("ha-menu-button");
  menu.hass = hass;
  menu.narrow = narrow;
  header.append(menu, el("h1", title), ...actions);
  return header;
}

export function notice(message, kind = "status") {
  if (!["status", "loading", "empty", "error"].includes(kind)) {
    throw new TypeError("Unknown notice kind");
  }
  const node = el("div", message, kind === "error" ? "notice error" : "notice");
  node.setAttribute("role", kind === "error" ? "alert" : "status");
  node.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
  if (kind === "loading") node.setAttribute("aria-busy", "true");
  return node;
}

/** Native modal provides focus trapping, Escape handling and focus restoration. */
export function confirmDialog(host, { title, message, confirmLabel = "Confirm", cancelLabel = "Cancel" }) {
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
export { actionButton, iconButton, nativeTextField, nativeForm } from "./native.js";

export { iframePanelStyles } from "./iframe-panel.js";
