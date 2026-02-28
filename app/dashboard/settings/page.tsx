"use client";

import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette } from "lucide-react";

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
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <Header />

      <AnimatedSection icon={<User size={18} />} title="Profile Settings">
        <Input label="Full Name" value={name} onChange={setName} />
        <Input label="Role" value={role} onChange={setRole} />

        <button
          onClick={saveProfile}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-xl shadow-md"
        >
          Save Profile
        </button>
      </AnimatedSection>

      <AnimatedSection icon={<Palette size={18} />} title="Theme Preferences">
        <ModernToggle
          label="Dark Mode"
          enabled={settings.theme === "dark"}
          onToggle={() =>
            updateSettings({
              theme: settings.theme === "dark" ? "light" : "dark",
            })
          }
        />
      </AnimatedSection>

      <AnimatedSection icon={<Bell size={18} />} title="Notification Settings">
        <ModernToggle
          label="Enable Notifications"
          enabled={settings.notificationsEnabled}
          onToggle={() =>
            updateSettings({
              notificationsEnabled: !settings.notificationsEnabled,
            })
          }
        />

        <ModernToggle
          label="ICU Auto Monitoring"
          enabled={settings.icuAutoMonitoring}
          onToggle={() =>
            updateSettings({
              icuAutoMonitoring: !settings.icuAutoMonitoring,
            })
          }
        />

        <ModernToggle
          label="Auto Resolve Alerts"
          enabled={settings.autoResolveAlerts}
          onToggle={() =>
            updateSettings({
              autoResolveAlerts: !settings.autoResolveAlerts,
            })
          }
        />
      </AnimatedSection>
    </div>
  );
}

/* ========================= COMPONENTS ========================= */

function Header() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <p className="text-gray-500 mt-1">
        Manage your profile and system preferences
      </p>
    </div>
  );
}

function AnimatedSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      {children}
    </motion.div>
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
      <label className="text-sm text-gray-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );
}

function ModernToggle({
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
      <span className="text-gray-700">{label}</span>

      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-6 h-6 bg-white rounded-full absolute top-0.5"
          style={{
            left: enabled ? "calc(100% - 26px)" : "2px",
          }}
        />
      </motion.button>
    </div>
  );
}