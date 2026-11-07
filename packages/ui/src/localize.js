import { haContext } from "./preferences.js";

import commonMessages from "./translations/en.json" with { type: "json" };
import { formatNumber } from "./preferences.js";
const nativeKeys = {
  save: "ui.common.save", cancel: "ui.common.cancel", close: "ui.common.close",
  delete: "ui.common.delete", edit: "ui.common.edit", add: "ui.common.add",
  refresh: "ui.common.refresh", loading: "ui.common.loading", retry: "ui.common.retry",
  yes: "ui.common.yes", no: "ui.common.no", apply: "ui.common.apply",
};

export function localize(hass, messages, key, values = {}) {
  const shortKey = key.replace(/^common\./, "");
  const nativeKey = nativeKeys[shortKey];
  const native = nativeKey && hass?.localize?.(nativeKey);
  const message = native && native !== nativeKey ? native : messages[key] || commonMessages[shortKey] || key;
  return String(message).replace(/\{([\w]+)\}/g, (match, name) => {
    if (!Object.hasOwn(values, name)) return match;
    return typeof values[name] === "number" ? formatNumber(hass, values[name]) : String(values[name]);
  });
}

export function createLocalizer(getHass, messages) {
  return (key, values) => localize(getHass?.() || haContext(), messages, key, values);
}

/** Translate schema presentation text while preserving field names and values. */
export function localizeSchema(hass, schema, messages) {
  if (Array.isArray(schema)) return schema.map(value => localizeSchema(hass, value, messages));
  if (!schema || typeof schema !== "object") return schema;
  return Object.fromEntries(Object.entries(schema).map(([key, value]) => {
    const messageKey = `schema.${value}`;
    if (["title", "description"].includes(key) && typeof value === "string" && messages[messageKey]) {
      return [key, localize(hass, messages, messageKey)];
    }
    return [key, localizeSchema(hass, value, messages)];
  }));
}
