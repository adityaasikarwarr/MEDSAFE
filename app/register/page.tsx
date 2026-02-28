"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    if (!email) return;

    login({
      name,
      email,
      role: "Doctor",
    });

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-10 space-y-6 bg-white shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold text-center">
          Create Your Account
        </h1>

        <input
          placeholder="Full Name"
          className="w-full p-3 border rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full p-3 border rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full py-3 text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}