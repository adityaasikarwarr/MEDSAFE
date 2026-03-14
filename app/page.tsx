"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  Bell,
  BarChart3,
  HeartPulse,
  AlertTriangle,
} from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const navbarOffset = 90;

    const y =
      element.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8FAFC]">
      {/* ===== BACKGROUND GRADIENT LIGHTS ===== */}

      <div className="fixed inset-0 -z-10">
        <div className="absolute w-[700px] h-[700px] bg-blue-500/20 blur-[140px] -top-40 -left-40" />

        <div className="absolute w-[700px] h-[700px] bg-indigo-500/20 blur-[140px] bottom-[-200px] right-[-200px]" />
      </div>

      {/* ===== NAVBAR ===== */}

      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/70 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4 mx-auto max-w-7xl">
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            MedSafe AI
          </h1>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 transition hover:text-blue-600"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-600 transition hover:text-blue-600"
            >
              About
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-600 transition hover:text-blue-600"
            >
              Contact
            </button>

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 transition hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="px-4 py-2 text-white transition bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-white transition bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="text-gray-600 transition hover:text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}

      <section className="relative px-6 text-center pt-44 pb-36">
        {/* floating card 1 */}

        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 20 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          className="absolute hidden p-5 bg-white shadow-xl left-10 top-44 rounded-2xl md:block"
        >
          <div className="flex items-center gap-2 text-red-500">
            <HeartPulse size={20} />
            <p className="text-sm font-semibold">Heart Rate</p>
          </div>
          <p className="mt-1 text-2xl font-bold">104 bpm</p>
        </motion.div>

        {/* floating card 2 */}

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: -20 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute hidden p-5 bg-white shadow-xl right-10 top-60 rounded-2xl md:block"
        >
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle size={20} />
            <p className="text-sm font-semibold">Alert</p>
          </div>

          <p className="mt-1 font-semibold text-gray-800">
            Medication Conflict
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-6xl font-bold leading-tight text-gray-900"
        >
          AI Powered
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
            Clinical Monitoring
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mt-6 text-lg text-gray-600"
        >
          Real-time ICU monitoring, medication safety detection, automated
          clinical alerts, and hospital analytics — all inside one intelligent
          platform.
        </motion.p>

        {/* ECG WAVE */}

        <div className="flex justify-center mt-10">
          <svg width="400" height="80">
            <motion.path
              d="M0 40 L40 40 L60 10 L80 70 L100 40 L140 40 L160 20 L180 60 L200 40 L240 40 L260 10 L280 70 L300 40 L340 40 L360 20 L380 60 L400 40"
              stroke="#2563EB"
              strokeWidth="3"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-6 mt-10"
        >
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-8 py-3 text-white transition bg-blue-600 shadow-xl rounded-xl hover:bg-blue-700 hover:shadow-2xl"
              >
                Get Started
              </Link>

              <button
                onClick={() => scrollToSection("features")}
                className="px-8 py-3 transition border border-gray-300 rounded-xl hover:bg-gray-100"
              >
                Explore Platform
              </button>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-8 py-3 text-white transition bg-blue-600 shadow-xl rounded-xl hover:bg-blue-700"
            >
              Open Dashboard
            </Link>
          )}
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}

      <section id="features" className="py-28">
        <div className="max-w-6xl px-6 mx-auto text-center">
          <h3 className="mb-16 text-4xl font-bold text-gray-800">
            Platform Capabilities
          </h3>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Activity size={26} />}
              title="ICU Live Monitoring"
              desc="Continuous vital tracking with anomaly detection."
            />

            <FeatureCard
              icon={<ShieldCheck size={26} />}
              title="Medication Intelligence"
              desc="Detect dangerous drug interactions instantly."
            />

            <FeatureCard
              icon={<Bell size={26} />}
              title="Alert Automation"
              desc="Smart clinical alerts with severity classification."
            />

            <FeatureCard
              icon={<BarChart3 size={26} />}
              title="Clinical Analytics"
              desc="Patient risk distribution and hospital insights."
            />
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}

      <section
        id="about"
        className="py-28 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="max-w-4xl px-6 mx-auto text-center">
          <h3 className="mb-6 text-4xl font-bold text-gray-800">
            About MedSafe AI
          </h3>

          <p className="leading-relaxed text-gray-600">
            MedSafe AI is a clinical intelligence platform designed to enhance
            hospital monitoring through real-time patient tracking, automated
            alerts, and advanced analytics.
          </p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}

      <section id="contact" className="py-28">
        <div className="max-w-3xl px-6 mx-auto text-center">
          <h3 className="mb-6 text-4xl font-bold text-gray-800">Contact</h3>

          <p className="mb-8 text-gray-600">
            For partnerships or collaboration inquiries.
          </p>

          <div className="space-y-3 text-gray-700">
            <p>Email: support@medsafeai.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Clinical Innovation Center</p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-sm text-center text-gray-500 bg-white border-t">
        © {new Date().getFullYear()} MedSafe AI. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.03 }}
      className="p-8 transition bg-white border shadow-sm rounded-2xl hover:shadow-2xl"
    >
      <div className="flex justify-center mb-5 text-blue-600">
        <div className="p-3 bg-blue-100 rounded-xl">{icon}</div>
      </div>

      <h4 className="mb-2 text-lg font-semibold text-gray-800">{title}</h4>

      <p className="text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
}
