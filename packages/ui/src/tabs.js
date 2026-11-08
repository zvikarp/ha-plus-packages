import { el } from "./dom.js";

let nextTabsId = 0;
export const tabStyles = `
  .ha-plus-tabs { display: flex; gap: 0; min-height: 48px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
  .ha-plus-tabs [role=tab] {
    flex: 0 0 auto; min-width: 96px; min-height: 48px; padding: 0 24px; border: 0; border-bottom: 3px solid transparent;
    border-radius: 0; background: transparent; color: var(--secondary-text-color, #727272);
    font: 500 14px var(--ha-font-family-body, var(--primary-font-family, Roboto, sans-serif)); cursor: pointer;
  }
  .ha-plus-tabs [role=tab][aria-selected=true] { color: var(--primary-color, #03a9f4); border-bottom-color: var(--primary-color, #03a9f4); }
  .ha-plus-tabs [role=tab]:hover { background: var(--secondary-background-color, #f5f5f5); }
  .ha-plus-tabs [role=tab]:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: -4px; }
`;

export function tabs(items, value, change, label) {
  const list = el("div", undefined, "ha-plus-tabs");
  list.setAttribute("role", "tablist");
  list.setAttribute("aria-label", label);
  const id = `ha-plus-tabs-${++nextTabsId}`;
  const controls = items.map(item => {
    const control = el("button", item.label);
    control.type = "button";
    control.id = `${id}-${item.value}`;
    control.dataset.value = item.value;
    control.setAttribute("role", "tab");
    control.addEventListener("click", () => { list.value = item.value; change(item.value); });
    list.append(control);
    return control;
  });
  Object.defineProperty(list, "value", {
    get: () => value,
    set: next => {
      if (!items.some(item => item.value === next)) return;
      value = next;
      controls.forEach(control => {
        const selected = control.dataset.value === next;
        control.setAttribute("aria-selected", String(selected));
        control.tabIndex = selected ? 0 : -1;
      });
    },
  });
  list.value = value;
  list.addEventListener("keydown", event => {
    const current = controls.indexOf(event.target);
    if (current < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const rtl = list.ownerDocument.defaultView.getComputedStyle(list).direction === "rtl";
    let index;
    if (event.key === "Home") index = 0;
    else if (event.key === "End") index = controls.length - 1;
    else {
      const forward = (event.key === "ArrowRight") !== rtl;
      index = (current + (forward ? 1 : -1) + controls.length) % controls.length;
    }
    controls[index].focus();
    controls[index].click();
  });
  return list;
}
