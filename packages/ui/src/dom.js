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
  const registry = document.defaultView?.customElements;
  const native = registry?.get("ha-button") ? "ha-button" : registry?.get("mwc-button") ? "mwc-button" : "button";
  const node = el(native, text, className);
  node.type = "button";
  node.disabled = disabled;
  if (native === "ha-button") node.appearance = className?.split(" ").includes("primary") ? "accent" : "plain";
  if (native === "mwc-button") node.raised = Boolean(className?.split(" ").includes("primary"));
  node.addEventListener("click", () => { if (!node.disabled) handler(); });
  return node;
}
