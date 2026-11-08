/** HA user preferences are resolved on every read so profile changes stay live. */
export function haContext() {
  if (typeof window === "undefined") return undefined;
  try {
    return window.parent?.document.querySelector("home-assistant")?.hass ||
      window.document.querySelector("home-assistant")?.hass;
  } catch {
    return undefined;
  }
}

export function preferences(hass = haContext()) {
  const locale = hass?.locale || {};
  const language = locale.language || hass?.language || "en";
  const numberLocales = { comma_decimal: "en-US", decimal_comma: "de-DE", space_comma: "sv-SE" };
  const numberLanguage = numberLocales[locale.number_format] ||
    (locale.number_format === "system" && typeof navigator !== "undefined" ? navigator.language : language);
  const direction = hass?.translationMetadata?.translations?.[language]?.isRTL ||
    /^(ar|fa|he|ur)(-|$)/i.test(language) ? "rtl" : "ltr";
  const dateLocales = { DMY: "en-GB", MDY: "en-US", YMD: "sv-SE" };
  const dateLanguage = dateLocales[locale.date_format] || (locale.date_format === "system" && typeof navigator !== "undefined" ? navigator.language : language);
  const timeLanguage = locale.time_format === "system" && typeof navigator !== "undefined" ? navigator.language : language;
  const languageHour12 = new Intl.DateTimeFormat(timeLanguage, { hour: "numeric" }).resolvedOptions().hour12;
  return {
    dateLanguage, language, direction, numberLanguage,
    useGrouping: locale.number_format !== "none",
    timeZone: locale.time_zone === "local" ? Intl.DateTimeFormat().resolvedOptions().timeZone : hass?.config?.time_zone,
    hour12: ["12", "am_pm"].includes(locale.time_format) ? true : ["24", "twenty_four"].includes(locale.time_format) ? false : languageHour12,
    unitSystem: { ...hass?.config?.unit_system },
  };
}

export function applyPreferences(host, hass) {
  const value = preferences(hass);
  if (host.getAttribute("dir") !== value.direction) host.setAttribute("dir", value.direction);
  if (host.getAttribute("lang") !== value.language) host.setAttribute("lang", value.language);
  return value;
}

export function formatNumber(hass, value, options = {}) {
  const settings = preferences(hass);
  return new Intl.NumberFormat(settings.numberLanguage, { useGrouping: settings.useGrouping, ...options }).format(value);
}

export function formatDateTime(hass, value, options = {}) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  const settings = preferences(hass);
  const dateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  return new Intl.DateTimeFormat(settings.dateLanguage, {
    dateStyle: "medium", timeStyle: dateOnly ? undefined : "short", timeZone: dateOnly ? "UTC" : settings.timeZone,
    hour12: settings.hour12, ...options,
  }).format(date);
}

export function formatEntityState(hass, entity) {
  if (!entity) return hass?.localize?.("state.default.unavailable") || "Unavailable";
  if (typeof hass?.formatEntityState === "function") return hass.formatEntityState(entity);
  if (["unknown", "unavailable"].includes(entity.state)) {
    return hass?.localize?.(`state.default.${entity.state}`) || entity.state;
  }
  const number = entity.state === "" ? NaN : Number(entity.state);
  const precision = entity.attributes?.suggested_display_precision;
  const value = Number.isFinite(number) ? formatNumber(hass, number,
    Number.isInteger(precision) && precision >= 0 && precision <= 20 ? { minimumFractionDigits: precision, maximumFractionDigits: precision } : {}) : entity.state;
  const unit = entity.attributes?.unit_of_measurement;
  return unit ? `${value}\u00a0${unit}` : String(value);
}

export function relativeCalendarDate(hass, value, now = Date.now()) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return undefined;
  const settings = preferences(hass);
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: settings.timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const day = value => {
    const parts = Object.fromEntries(formatter.formatToParts(value).map(({ type, value }) => [type, value]));
    return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) / 86400000;
  };
  const days = day(date) - day(new Date(now));
  if (days === 0) return new Intl.RelativeTimeFormat(settings.language, { numeric: "auto" }).format(0, "day");
  return new Intl.RelativeTimeFormat(settings.language, { numeric: "always" }).format(days, "day");
}
