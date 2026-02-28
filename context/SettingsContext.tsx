"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Settings = {
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  icuAutoMonitoring: boolean;
  autoResolveAlerts: boolean;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (data: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    notificationsEnabled: true,
    icuAutoMonitoring: true,
    autoResolveAlerts: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("medsafe-settings");
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("medsafe-settings", JSON.stringify(settings));
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark",
    );
  }, [settings]);

  const updateSettings = (data: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
