/*! @ha-plus/ui v0.1.0 | MIT | Copyright (c) 2026 HA+ contributors | https://github.com/zvikarp/ha-plus-packages/blob/main/LICENSE */
/** Theme styles are scoped to the consuming shadow root and inherit HA variables. */
export const themeStyles = `
  :host { display:block; color:var(--primary-text-color,#212121); font-family:var(--primary-font-family,var(--paper-font-body1_-_font-family,Roboto,sans-serif)); }
  *, *::before, *::after { box-sizing:border-box; }
  [hidden] { display:none !important; }
  a { color:var(--primary-color,#03a9f4); }
  ha-icon { flex-shrink:0; }
  button, input, select, textarea { font:inherit; }
  button { min-height:44px; padding:10px 16px; border:0; border-radius:var(--ha-button-border-radius,999px); background:var(--secondary-background-color,#f5f5f5); color:var(--primary-color,#03a9f4); cursor:pointer; font-weight:500; }
  button:hover { filter:brightness(.96); }
  button.primary { background:var(--primary-color,#03a9f4); color:var(--text-primary-color,#fff); }
  button.danger { color:var(--error-color,#db4437); }
  button:disabled { opacity:.5; cursor:default; }
  :is(button,input,select,textarea,a,summary,[tabindex]):focus-visible { outline:2px solid var(--primary-color,#03a9f4); outline-offset:3px; }
  .icon-button { display:grid; place-items:center; width:44px; height:44px; min-width:44px; padding:0; border-radius:50%; color:inherit; background:transparent; }
  .icon-button:hover { background:var(--secondary-background-color,#f5f5f5); }
  input:not([type=checkbox]):not([type=radio]), textarea { min-height:48px; border:1px solid var(--divider-color,#e0e0e0); border-radius:var(--ha-input-border-radius,14px); padding:10px 14px; color:var(--primary-text-color,#212121); background:var(--secondary-background-color,#f5f5f5); max-width:100%; }
  ha-card { display:block; background:var(--ha-card-background,var(--card-background-color,#fff)); color:var(--primary-text-color,#212121); border-radius:var(--ha-card-border-radius,12px); box-shadow:var(--ha-card-box-shadow,none); border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color,#e0e0e0)); }
  .field { position:relative; min-width:0; }
  .field-label { display:block; margin-bottom:8px; color:var(--secondary-text-color,#727272); font-size:14px; }
  .combobox { display:flex; align-items:center; gap:8px; width:100%; justify-content:space-between; text-align:start; border:1px solid var(--divider-color,#e0e0e0); border-radius:14px; color:var(--primary-text-color,#212121); min-height:48px; padding:10px 14px; }
  .combobox span { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .listbox { position:absolute; z-index:10; inset-inline:0; top:100%; margin-top:4px; max-height:300px; overflow:auto; padding:6px; background:var(--card-background-color,#fff); border:1px solid var(--divider-color,#e0e0e0); border-radius:14px; box-shadow:var(--ha-card-box-shadow,0 4px 16px #0003); }
  .option { display:block; width:100%; text-align:start; border-radius:10px; background:transparent; color:var(--primary-text-color,#212121); white-space:normal; overflow-wrap:anywhere; }
  .option[aria-selected=true] { color:var(--primary-color,#03a9f4); background:var(--secondary-background-color,#f5f5f5); }
  .ha-plus-header { display:flex; align-items:center; gap:12px; padding:12px 16px; min-height:64px; background:var(--app-header-background-color,var(--primary-background-color,#fafafa)); color:var(--app-header-text-color,var(--primary-text-color,#212121)); }
  .ha-plus-header h1 { font-size:20px; font-weight:400; flex:1; margin:0; }
  .ha-plus-content { max-width:1000px; margin:auto; padding:24px; }
  .notice { padding:12px 16px; margin-bottom:16px; background:var(--secondary-background-color,#f5f5f5); border-radius:14px; overflow-wrap:anywhere; }
  .error { color:var(--error-color,#db4437); white-space:pre-wrap; }
  dialog { font:inherit; background:var(--ha-card-background,var(--card-background-color,#fff)); color:var(--primary-text-color,#212121); border:1px solid var(--divider-color,#e0e0e0); border-radius:var(--ha-dialog-border-radius,20px); padding:24px; width:420px; max-width:calc(100% - 32px); max-height:calc(100% - 32px); overflow:auto; }
  dialog::backdrop { background:#0008; }
  dialog h2 { margin:0 0 16px; font-size:1.3rem; }
  dialog p { white-space:pre-line; overflow-wrap:anywhere; }
  dialog form { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:12px; margin-top:24px; }
  @media(max-width:700px) { .ha-plus-content { padding:16px; } .ha-plus-header h1 { font-size:18px; } }
`;

export function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function icon(name) {
  const node = el("ha-icon");
  node.setAttribute("icon", name);
  return node;
}
export function button(text, handler, disabled = false, className) {
  const node = el("button", text, className);
  node.type = "button";
  node.disabled = disabled;
  node.addEventListener("click", handler);
  return node;
}

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
