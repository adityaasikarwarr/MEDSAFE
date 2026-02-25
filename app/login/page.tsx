"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (!email) return;
    login(email);
    router.push("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#F4F7FB]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-6">
        <h1 className="text-2xl font-bold text-center">Login to MedSafe AI</h1>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full border px-4 py-2 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
