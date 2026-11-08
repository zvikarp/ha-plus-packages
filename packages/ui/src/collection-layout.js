import { button, icon } from "./dom.js";

export const collectionLayoutStyles = `
  .ha-plus-collection-layout {
    --ha-plus-collection-header-height: var(--header-height, 56px);
    display: grid;
    grid-template-columns: 256px minmax(0, 1fr);
    min-height: calc(100dvh - var(--ha-plus-collection-header-height));
  }
  .ha-plus-collection-layout.ha-plus-embedded { --ha-plus-collection-header-height: 0px; }
  .ha-plus-collection-nav {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: var(--ha-plus-collection-header-height);
    height: calc(100dvh - var(--ha-plus-collection-header-height));
    box-sizing: border-box;
    padding: 12px 8px;
    border-inline-end: 1px solid var(--divider-color, #e0e0e0);
    background: var(--sidebar-background-color, var(--card-background-color, #fff));
  }
  .ha-plus-collection-items { flex: 1; overflow: auto; min-height: 0; }
  .ha-plus-collection-nav h2 { margin: 20px 16px 8px; color: var(--secondary-text-color, #727272); font-size: 12px; font-weight: 500; }
  .ha-plus-collection-item {
    display: flex; align-items: center; gap: 16px; width: 100%; min-height: 56px;
    box-sizing: border-box; padding: 8px 16px; border: 0; border-radius: 4px;
    background: transparent; color: var(--primary-text-color, #212121); text-align: start;
    font: inherit; text-decoration: none; cursor: pointer;
  }
  .ha-plus-collection-item:hover { background: var(--secondary-background-color, #f5f5f5); }
  .ha-plus-collection-item[aria-current=page] { color: var(--primary-color, #03a9f4); background: var(--ha-color-fill-primary-quiet-resting, var(--secondary-background-color, #f5f5f5)); }
  .ha-plus-collection-item:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: -2px; }
  .ha-plus-collection-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .ha-plus-collection-count { color: var(--secondary-text-color, #727272); font-size: 12px; }
  .ha-plus-collection-create { padding: 16px 8px 4px; }
  .ha-plus-create-button {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 40px; padding: 0 16px; border: 0; border-radius: var(--ha-button-border-radius, 999px);
    background: var(--ha-color-fill-primary-normal-resting, #d9f2fc);
    color: var(--ha-color-on-primary-quiet, var(--primary-color, #03a9f4));
    text-decoration: none; font: 500 14px var(--ha-font-family-body, var(--primary-font-family, Roboto, sans-serif)); cursor: pointer;
  }
  ha-button.ha-plus-create-button, mwc-button.ha-plus-create-button { padding: 0; background: transparent; }
  .ha-plus-collection-create .ha-plus-create-button { width: 100%; box-sizing: border-box; --ha-button-width: 100%; }
  .ha-plus-create-button:hover { background: var(--ha-color-fill-primary-normal-hover, #caebf9); }
  .ha-plus-create-button:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 3px; }
  .ha-plus-create-button ha-icon { --mdc-icon-size: 20px; }
  .ha-plus-collection-body { display: flex; flex-direction: column; min-width: 0; min-height: calc(100dvh - var(--ha-plus-collection-header-height)); }
  .ha-plus-collection-content { flex: 1; min-width: 0; width: 100%; max-width: 1000px; margin-inline: auto; padding: 24px; box-sizing: border-box; }
  .ha-plus-collection-mobile { display: none; padding: 16px; }
  .ha-plus-collection-mobile label { display: block; margin-bottom: 8px; color: var(--secondary-text-color, #727272); }
  .ha-plus-collection-mobile select { width: 100%; min-height: 48px; padding: 8px 12px; background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; font: inherit; }
  .ha-plus-collection-mobile .ha-plus-create-button { margin-top: 12px; }
  .ha-plus-collection-host { container-type: inline-size; }
  @media (max-width: 750px) {
    .ha-plus-collection-layout { display: block; }
    .ha-plus-collection-nav { display: none; }
    .ha-plus-collection-mobile { display: block; }
    .ha-plus-collection-content { padding: 0 16px 24px; }
  }
  @container (max-width: 750px) {
    .ha-plus-collection-layout { display: block; }
    .ha-plus-collection-nav { display: none; }
    .ha-plus-collection-mobile { display: block; }
    .ha-plus-collection-content { padding: 0 16px 24px; }
  }
`;

export function collectionCreateButton(label, handler, disabled = false) {
  const control = button(undefined, handler, disabled, "ha-plus-create-button");
  if (control.localName === "ha-button") control.appearance = "filled";
  const plus = icon("mdi:plus");
  if (control.localName !== "button") plus.slot = control.localName === "mwc-button" ? "icon" : "start";
  control.append(plus, document.createTextNode(label));
  return control;
}
