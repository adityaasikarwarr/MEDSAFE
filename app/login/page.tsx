"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity, ShieldCheck } from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor");
  const handleLogin = () => {
    if (!email || !password) return;
    login({ name, role, email });
    router.push("/dashboard");
  };
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      {" "}
      {/* Floating Blobs */}{" "}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" />{" "}
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-400 opacity-20 rounded-full blur-3xl animate-pulse" />{" "}
      {/* LEFT SIDE – BRANDING */}{" "}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex-col justify-center flex-1 hidden px-20 lg:flex"
      >
        {" "}
        <h1 className="text-4xl font-bold text-gray-800">MedSafe AI</h1>{" "}
        <p className="max-w-md mt-4 leading-relaxed text-gray-600">
          {" "}
          A next-generation clinical intelligence platform designed to enhance
          ICU monitoring, medication safety, and real-time alert
          management.{" "}
        </p>{" "}
        <div className="mt-10 space-y-6">
          {" "}
          <Feature icon={<Activity />} text="Real-time ICU monitoring" />{" "}
          <Feature
            icon={<ShieldCheck />}
            text="Automated risk detection"
          />{" "}
        </div>{" "}
      </motion.div>{" "}
      {/* RIGHT SIDE – LOGIN FORM */}{" "}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-center flex-1 p-8"
      >
        {" "}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-10 border shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl border-white/40"
        >
          {" "}
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {" "}
            Welcome Back{" "}
          </h2>{" "}
          <p className="mt-2 text-sm text-center text-gray-500">
            {" "}
            Secure access to your clinical dashboard{" "}
          </p>{" "}
          <div className="mt-8 space-y-5">
            {" "}
            <InputField
              label="Full Name"
              value={name}
              onChange={setName}
              placeholder="Dr. John Doe"
            />{" "}
            <InputField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="doctor@hospital.com"
              type="email"
            />{" "}
            <InputField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              type="password"
            />{" "}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              className="w-full py-3 font-semibold text-white transition shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
            >
              {" "}
              Sign In Securely{" "}
            </motion.button>{" "}
          </div>{" "}
          <p className="mt-6 text-xs text-center text-gray-400">
            {" "}
            HIPAA-level encrypted session simulation{" "}
          </p>{" "}
        </motion.div>{" "}
      </motion.div>{" "}
    </div>
  );
}
/* ================= INPUT FIELD ================= */ function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      {" "}
      <label className="text-sm text-gray-600">{label}</label>{" "}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 mt-2 text-gray-800 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />{" "}
    </div>
  );
}
/* ================= FEATURE ITEM ================= */ function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      {" "}
      <div className="text-blue-600">{icon}</div> <span>{text}</span>{" "}
    </div>
  );
}
