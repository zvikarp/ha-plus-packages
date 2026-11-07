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

