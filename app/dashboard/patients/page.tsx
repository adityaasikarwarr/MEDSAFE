"use client";

import { useState } from "react";
import { usePatients } from "@/context/PatientContext";
import { Patient } from "@/types/patient";
import { motion } from "framer-motion";

export default function PatientsPage() {
  const { patients, addPatient } = usePatients();
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    department: "ICU",
    diagnosis: "",
    heartRate: "",
    oxygen: "",
    bloodPressure: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newPatient: Patient = {
      id: Date.now(),
      name: form.name,
      age: Number(form.age),
      gender: form.gender as any,
      department: form.department,
      diagnosis: form.diagnosis,
      status: "Admitted",
      risk: "Low",
      medications: [],
      vitals: {
        hr: Number(form.heartRate),
        o2: Number(form.oxygen),
        bp: form.bloodPressure,
      },
    };

    await addPatient(newPatient);
    setShowModal(false);

    setForm({
      name: "",
      age: "",
      gender: "Male",
      department: "ICU",
      diagnosis: "",
      heartRate: "",
      oxygen: "",
      bloodPressure: "",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          + Add Patient
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-[650px] p-8 rounded-2xl shadow-2xl border"
          >
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Register New Patient
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Gender + Department */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="p-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="p-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ICU">ICU</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Diagnosis */}
              <input
                name="diagnosis"
                placeholder="Diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Condition / Risk */}
              <select
                name="risk"
                value={form.risk}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low Condition</option>
                <option value="Medium">Medium Condition</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Condition</option>
              </select>

              {/* Vitals */}
              <div className="grid grid-cols-3 gap-4">
                <input
                  name="heartRate"
                  type="number"
                  placeholder="Heart Rate (bpm)"
                  value={form.heartRate}
                  onChange={handleChange}
                  required
                  className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  name="oxygen"
                  type="number"
                  placeholder="Oxygen (%)"
                  value={form.oxygen}
                  onChange={handleChange}
                  required
                  className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  name="bloodPressure"
                  placeholder="Blood Pressure"
                  value={form.bloodPressure}
                  onChange={handleChange}
                  required
                  className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-gray-600 transition border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Save Patient
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Patient List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((p) => (
          <div key={p.id} className="p-6 bg-white border shadow-md rounded-2xl">
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-500">{p.department}</p>
            <p className="mt-2 text-sm">Diagnosis: {p.diagnosis}</p>
            <p className="text-sm">Risk: {p.risk}</p>
            <p className="text-sm">Status: {p.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
