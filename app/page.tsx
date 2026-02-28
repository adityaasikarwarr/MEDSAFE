"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  Bell,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuth();

  /* ================= SMOOTH SCROLL FUNCTION ================= */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const navbarOffset = 90;

    const y =
      element.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/70 backdrop-blur-lg">
        <div className="flex items-center justify-between px-8 py-4 mx-auto max-w-7xl">

          <h1 className="text-xl font-bold text-gray-800">
            MedSafe AI
          </h1>

          <nav className="flex items-center gap-6 text-sm font-medium">

            {/* Section Buttons */}
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

            {/* Auth Aware Buttons */}
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
                  className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
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

      {/* ================= HERO ================= */}
      <section className="px-6 pt-40 text-center pb-28">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-5xl font-bold text-gray-800"
        >
          Intelligent Clinical Monitoring Platform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-2xl mx-auto mt-6 text-lg text-gray-600"
        >
          Real-time ICU monitoring, medication safety intelligence,
          automated alerts, and predictive analytics —
          unified into one powerful medical dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="flex justify-center gap-6 mt-10"
        >
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-8 py-3 text-white transition bg-blue-600 shadow-lg rounded-xl hover:shadow-xl hover:bg-blue-700"
              >
                Get Started
              </Link>

              <button
                onClick={() => scrollToSection("features")}
                className="px-8 py-3 text-blue-600 transition border border-blue-600 rounded-xl hover:bg-blue-50"
              >
                Explore Features
              </button>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-8 py-3 text-white transition bg-blue-600 shadow-lg rounded-xl hover:shadow-xl hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          )}
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="py-24 bg-white"
      >
        <div className="max-w-6xl px-6 mx-auto text-center">

          <h3 className="mb-16 text-3xl font-bold text-gray-800">
            Core Platform Features
          </h3>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              icon={<Activity size={28} />}
              title="ICU Live Monitoring"
              desc="Continuous vital simulation with automatic risk scoring."
            />

            <FeatureCard
              icon={<ShieldCheck size={28} />}
              title="Medication Intelligence"
              desc="Real-time drug interaction detection engine."
            />

            <FeatureCard
              icon={<Bell size={28} />}
              title="Smart Alert Engine"
              desc="Automated alert generation & resolution system."
            />

            <FeatureCard
              icon={<BarChart3 size={28} />}
              title="Clinical Analytics"
              desc="Department breakdown & risk distribution insights."
            />
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="max-w-4xl px-6 mx-auto text-center">

          <h3 className="mb-6 text-3xl font-bold text-gray-800">
            About MedSafe AI
          </h3>

          <p className="leading-relaxed text-gray-600">
            MedSafe AI is designed as a next-generation clinical
            intelligence system combining ICU monitoring,
            medication validation, alert automation,
            and predictive analytics in a single platform.
          </p>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        className="py-24 bg-white"
      >
        <div className="max-w-3xl px-6 mx-auto text-center">

          <h3 className="mb-6 text-3xl font-bold text-gray-800">
            Contact Us
          </h3>

          <p className="mb-8 text-gray-600">
            Questions? Collaboration? Reach our team anytime.
          </p>

          <div className="space-y-3 text-gray-700">
            <p>Email: support@medsafeai.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Clinical Innovation Center</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-sm text-center text-gray-500 bg-gray-100">
        © {new Date().getFullYear()} MedSafe AI. All rights reserved.
      </footer>
    </div>
  );
}

/* ================= FEATURE CARD ================= */
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
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-6 transition bg-white border shadow rounded-2xl hover:shadow-xl"
    >
      <div className="flex justify-center mb-4 text-blue-600">
        {icon}
      </div>

      <h4 className="mb-2 font-semibold text-gray-800">
        {title}
      </h4>

      <p className="text-sm text-gray-600">
        {desc}
      </p>
    </motion.div>
  );
}