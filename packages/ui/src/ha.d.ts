import type { HaPreferences } from "./react.js";
export interface HaContext {
  language?: string;
  locale?: { language?: string; number_format?: string; time_format?: string; date_format?: string; time_zone?: string };
  user?: { is_admin?: boolean };
  config?: { time_zone?: string; unit_system?: Record<string, string> };
  localize?: (key: string, ...args: unknown[]) => string;
  formatEntityState?: (entity: unknown) => string;
}
export declare function haContext(): HaContext | undefined;
export declare function preferences(hass?: HaContext): HaPreferences;
export declare function formatNumber(hass: HaContext | undefined, value: number, options?: Intl.NumberFormatOptions): string;
export declare function formatDateTime(hass: HaContext | undefined, value: string | number | Date, options?: Intl.DateTimeFormatOptions): string;
export declare function showMoreInfo(host: HTMLElement | undefined, entityId: string): boolean;
export declare function integrationUrl(domain: string, add?: boolean): string;
export declare function createLocalizer(getHass: (() => HaContext | undefined) | undefined, messages: Record<string, string>): (key: string, values?: Record<string, unknown>) => string;

export declare function showToast(host: HTMLElement | undefined, message: string): boolean;

export declare function localize(hass: HaContext | undefined, messages: Record<string, string>, key: string, values?: Record<string, unknown>): string;

export declare function localizeSchema<T>(hass: HaContext | undefined, schema: T, messages: Record<string, string>): T;
export declare function formatEntityState(hass: HaContext | undefined, entity: unknown): string;
export declare function relativeCalendarDate(hass: HaContext | undefined, value: string, now?: number): string | undefined;
