import { el, icon } from "./dom.js";

export function actionButton(
  label,
  handler,
  disabled = false,
  appearance = "plain",
) {
  // HA migrated from mwc-button to ha-button. Use the registered native control.
  const modern = Boolean(customElements.get("ha-button"));
  const node = el(modern ? "ha-button" : "mwc-button", label);
  node.type = "button";
  node.disabled = disabled;
  if (modern) {
    node.appearance = appearance === "danger" ? "plain" : appearance;
    node.variant = appearance === "danger" ? "danger" : "brand";
  } else {
    node.raised = appearance === "accent";
    if (appearance === "danger") node.classList.add("destructive");
  }
  node.addEventListener("click", () => {
    if (!node.disabled) handler();
  });
  return node;
}

export function iconButton(label, name, handler, disabled = false) {
  const node = el("ha-icon-button");
  node.label = label;
  node.disabled = disabled;
  node.append(icon(name));
  node.addEventListener("click", () => {
    if (!node.disabled) handler();
  });
  return node;
}

export function nativeTextField(label, value, change) {
  const node = el(customElements.get("ha-input") ? "ha-input" : "ha-textfield");
  node.label = label;
  node.placeholder = label;
  node.value = value;
  node.setAttribute("aria-label", label);
  node.addEventListener("input", () => change(node.value));
  return node;
}

export function nativeForm(hass, schema, data, change) {
  const form = el("ha-form");
  form.hass = hass;
  form.schema = schema;
  form.data = data;
  form.computeLabel = (field) => field.label;
  form.computeHelper = (field) => field.helper;
  form.addEventListener("value-changed", (event) => {
    event.stopPropagation();
    form.data = event.detail.value;
    change(event.detail.value);
  });
  return form;
}

/** HA's slider emits preview events during drag and commits on release or keyup. */
export function nativeSlider({ label, value, min = 0, max = 100, step = 1, disabled = false, hass, preview, change }) {
  const native = Boolean(document.defaultView?.customElements.get("ha-control-slider"));
  const tag = native ? "ha-control-slider" : document.defaultView?.customElements.get("ha-slider") ? "ha-slider" : "input";
  const control = el(tag);
  if (tag === "input") control.type = "range";
  Object.assign(control, { min, max, step, value, disabled });
  control.label = label;
  control.locale = hass?.locale;
  control.setAttribute("aria-label", label);
  let committed = Number(value);
  const read = event => Number(event.detail?.value ?? control.value);
  control.addEventListener(native ? "slider-moved" : "input", event => {
    if (native && event.detail?.value == null) return;
    const next = read(event);
    if (!control.disabled && Number.isFinite(next)) preview?.(next);
  });
  control.addEventListener(native ? "value-changed" : "change", event => {
    const next = read(event);
    if (control.disabled || !Number.isFinite(next) || next < min || next > max || next === committed) return;
    committed = next;
    change(next);
  });
  return control;
}

/** Follow HA's nested selector shadow roots when restoring keyboard focus. */
export async function focusControl(control) {
  if (!control) return;
  await control.updateComplete;
  if (!control.isConnected) return;
  const inner = control.shadowRoot?.querySelector(
    "ha-selector, ha-selector-select, ha-select, ha-picker-field, ha-combo-box, ha-input, ha-textfield, input, textarea, button, [tabindex='0']",
  );
  if (inner) return focusControl(inner);
  control.focus?.();
}
