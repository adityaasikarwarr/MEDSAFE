"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Leaf,
  Shield,
  Activity,
  Users,
  FileText,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F2F5F9] text-gray-800">
      {/* ================= NAVBAR ================= */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-8 py-4 mx-auto max-w-7xl">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl">
              <Heart size={18} />
            </div>
            <h1 className="text-lg font-semibold">
              Holisti<span className="text-teal-500">Doc AI</span>
            </h1>
          </div>

          {/* Center Nav */}
          <nav className="hidden gap-8 text-sm text-gray-600 md:flex">
            <Link
              href="/"
              className="px-4 py-2 font-medium text-blue-600 bg-gray-100 rounded-lg"
            >
              Home
            </Link>
          </nav>

          {/* Sign In */}
          <Link
            href="/login"
            className="px-5 py-2 text-sm text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl font-bold text-gray-800">
            Intelligent Clinical Monitoring, Simplified
          </h1>

          <p className="text-lg text-gray-500">
            Real-time ICU monitoring, automated alerts, and medication safety
            intelligence designed for modern healthcare systems.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl px-8 pb-24 mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Activity size={20} />}
            title="Real-Time ICU Monitoring"
            desc="Continuously monitor patient vitals with live severity detection and intelligent risk classification."
          />

          <Feature
            icon={<Shield size={20} />}
            title="Automated Clinical Alerts"
            desc="AI-powered alert engine detects critical patient conditions and notifies clinicians instantly."
          />

          <Feature
            icon={<Brain size={20} />}
            title="Medication Safety Intelligence"
            desc="Analyze prescriptions for potential risks, conflicts, and unsafe combinations before administration."
          />

          <Feature
            icon={<Users size={20} />}
            title="Centralized Patient Management"
            desc="Manage patient records, risk levels, departments, and treatment updates from a unified dashboard."
          />

          <Feature
            icon={<FileText size={20} />}
            title="Clinical Reporting & Summaries"
            desc="Generate structured clinical summaries and track historical patient risk progression."
          />

          <Feature
            icon={<Leaf size={20} />}
            title="Expert Attribution & Audit Trail"
            desc="Every recommendation and alert is traceable, ensuring accountability and regulatory transparency."
          />
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="px-8 pb-24">
        <div className="max-w-6xl p-16 mx-auto text-center text-white shadow-lg rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500">
          <h2 className="mb-4 text-3xl font-semibold">
            Ready to Take Control of Your Health?
          </h2>

          <p className="mb-8 opacity-90">
            Start your free AI-powered health consultation today and get
            personalized holistic wellness recommendations.
          </p>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 transition border rounded-xl bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-16 bg-white border-t">
        <div className="grid gap-10 px-8 mx-auto text-sm text-gray-600 max-w-7xl md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart size={18} className="text-blue-600" />
              <span className="font-semibold text-gray-800">HolistiDoc AI</span>
            </div>
            <p>
              AI-powered holistic healthcare guidance combining modern medicine
              with natural wellness.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-800">Platform</h4>
            <p>AI Consultation</p>
            <p>Dashboard</p>
            <p>About Us</p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-800">Support</h4>
            <p>Contact</p>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-800">Disclaimer</h4>
            <p>
              HolistiDoc AI provides general wellness guidance only and is not a
              substitute for professional medical advice.
            </p>
          </div>
        </div>

        <div className="mt-12 text-xs text-center text-gray-400">
          © 2026 HolistiDoc AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Feature({
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
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="p-6 transition bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md"
    >
      <div className="p-3 mb-4 text-blue-600 bg-blue-50 w-fit rounded-xl">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
    </motion.div>
  );
}
