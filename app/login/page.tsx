"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;

    login({
      name,
      role: "Doctor",
      email,
    });

    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌈 Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 animate-gradientMove" />

      {/* ✨ Floating Color Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300 opacity-30 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl animate-blob animation-delay-2000" />

      {/* 🧊 Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-[2px] rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-borderMove"
      >
        {/* Inner Card */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">MedSafe AI</h1>
            <p className="text-gray-500 text-sm mt-2">
              Clinical Safety Platform
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="Dr. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="doctor@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-black"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
            >
              Sign In
            </motion.button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Secure clinical authentication
          </p>
        </div>
      </motion.div>
    </div>
  );
}
