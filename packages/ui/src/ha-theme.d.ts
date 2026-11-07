export interface HaTheme {
  direction?: "ltr" | "rtl";
  mode: "light" | "dark";
  primary: string;
  secondary: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  backgroundDefault: string;
  backgroundPaper: string;
  appHeaderBackground: string;
  appHeaderText: string;
}

export declare const defaultHaTheme: HaTheme;
export declare function readHaTheme(): HaTheme;
export declare function startHaThemeSync(
  onChange: (theme: HaTheme) => void,
): () => void;
