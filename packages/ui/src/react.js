import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { haContext, preferences } from "./preferences.js";
import { createLocalizer } from "./localize.js";

const HaPreferences = createContext(undefined);

export function HaPreferencesProvider({ children }) {
  const [settings, setSettings] = useState(() => preferences());
  useEffect(() => {
    const sync = () => {
      const next = preferences();
      setSettings(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      document.documentElement.dir = next.direction;
      document.documentElement.lang = next.language;
    };
    sync();
    const timer = window.setInterval(sync, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return createElement(HaPreferences.Provider, { value: settings }, children);
}

export function useHaPreferences() {
  return useContext(HaPreferences) || preferences();
}

export function useLocalizer(messages) {
  const settings = useHaPreferences();
  return useMemo(() => createLocalizer(haContext, messages), [settings, messages]);
}
