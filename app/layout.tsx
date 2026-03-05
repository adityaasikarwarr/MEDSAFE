import type { Metadata } from "next";
import "./globals.css";

import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { PatientProvider } from "@/context/PatientContext";
import { ActivityProvider } from "@/context/ActivityContext";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "MedSafe AI",
  description: "AI-powered clinical monitoring dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <SettingsProvider>
            <PatientProvider>
              <ActivityProvider>
                {children}

                {/* GLOBAL TOAST SYSTEM */}
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "#0f172a",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                    },
                  }}
                />
              </ActivityProvider>
            </PatientProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
