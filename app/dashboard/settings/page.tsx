"use client";

import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, login } = useAuth();
  const { settings, updateSettings } = useSettings();

  const [name, setName] = useState("");
  const [role, setRole] = useState("Doctor");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
    }
  }, [user]);

  const saveProfile = () => {
    if (!user) return;

    login({
      name,
      role,
      email: user.email,
    });

    alert("Profile Updated Successfully");
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <Section title="Profile Settings">
        <Input label="Full Name" value={name} onChange={setName} />
        <Input label="Role" value={role} onChange={setRole} />

        <button
          onClick={saveProfile}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl"
        >
          Save Profile
        </button>
      </Section>

      <Section title="Theme Preferences">
        <Toggle
          label="Dark Mode"
          enabled={settings.theme === "dark"}
          onToggle={() =>
            updateSettings({
              theme: settings.theme === "dark" ? "light" : "dark",
            })
          }
        />
      </Section>

      <Section title="Notification Settings">
        <Toggle
          label="Enable Notifications"
          enabled={settings.notificationsEnabled}
          onToggle={() =>
            updateSettings({
              notificationsEnabled: !settings.notificationsEnabled,
            })
          }
        />

        <Toggle
          label="ICU Auto Monitoring"
          enabled={settings.icuAutoMonitoring}
          onToggle={() =>
            updateSettings({
              icuAutoMonitoring: !settings.icuAutoMonitoring,
            })
          }
        />

        <Toggle
          label="Auto Resolve Alerts"
          enabled={settings.autoResolveAlerts}
          onToggle={() =>
            updateSettings({
              autoResolveAlerts: !settings.autoResolveAlerts,
            })
          }
        />
      </Section>
    </div>
  );
}

/* ========================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 transition rounded-2xl shadow border border-gray-100 dark:border-slate-700 p-6">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-6">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white transition"
      />
    </div>
  );
}

function Toggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>

      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all duration-300 ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        } relative`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5`}
          style={{
            left: enabled ? "calc(100% - 22px)" : "2px",
          }}
        />
      </button>
    </div>
  );
}
