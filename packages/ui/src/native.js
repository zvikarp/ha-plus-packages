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
