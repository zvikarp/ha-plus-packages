import type { PropsWithChildren, ReactElement } from "react";
export interface HaPreferences {
  language: string;
  dateLanguage: string;
  direction: "ltr" | "rtl";
  numberLanguage: string;
  useGrouping: boolean;
  timeZone?: string;
  hour12?: boolean;
  unitSystem: Record<string, string>;
}
export declare function HaPreferencesProvider(props: PropsWithChildren): ReactElement;
export declare function useHaPreferences(): HaPreferences;
export declare function useLocalizer(messages: Record<string, string>): (key: string, values?: Record<string, unknown>) => string;
