"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* ================= NAVBAR ================= */}
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-xl font-bold text-gray-800">MedSafe AI</h1>

        <div className="flex items-center gap-4">
          {/* If NOT logged in */}
          {!user && (
            <>
              <Link
                href="/login"
                className="font-medium text-gray-700 hover:text-blue-600"
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
          )}

          {/* If Logged in */}
          {user && (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="font-medium text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col items-center justify-center px-6 mt-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-5xl font-bold text-gray-800"
        >
          Intelligent Clinical Monitoring Platform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mt-6 text-lg text-gray-600"
        >
          Real-time ICU monitoring, medication safety intelligence, automated
          alert systems, and advanced analytics — all in one secure medical
          dashboard.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex gap-6 mt-10"
        >
          {/* If NOT logged in */}
          {!user && (
            <>
              <Link
                href="/login"
                className="px-6 py-3 text-white transition bg-blue-600 shadow-lg rounded-xl hover:shadow-xl hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-6 py-3 text-blue-600 transition border border-blue-600 rounded-xl hover:bg-blue-50"
              >
                Create Account
              </Link>
            </>
          )}

          {/* If Logged in */}
          {user && (
            <Link
              href="/dashboard"
              className="px-6 py-3 text-white transition bg-blue-600 shadow-lg rounded-xl hover:shadow-xl hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
}
