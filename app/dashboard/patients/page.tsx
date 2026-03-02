"use client";

import { useState } from "react";
import { usePatients } from "@/context/PatientContext";
import { useAuth } from "@/context/AuthContext";
import { Patient } from "@/types/patient";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import RoleGuard from "@/components/dashboard/RoleGuard";

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const { user } = useAuth();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const emptyForm = {
    name: "",
    age: "",
    gender: "Male",
    department: "ICU",
    diagnosis: "",
    risk: "Low",
    heartRate: "",
    oxygen: "",
    bloodPressure: "",
  };

  const [form, setForm] = useState<any>(emptyForm);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openAddModal() {
    setEditingPatient(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(patient: Patient) {
    setEditingPatient(patient);
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      department: patient.department,
      diagnosis: patient.diagnosis,
      risk: patient.risk,
      heartRate: patient.vitals?.hr || "",
      oxygen: patient.vitals?.o2 || "",
      bloodPressure: patient.vitals?.bp || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const patientData: Patient = {
      id: editingPatient ? editingPatient.id : Date.now(),
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      department: form.department,
      diagnosis: form.diagnosis,
      status: editingPatient?.status || "Admitted",
      risk: form.risk,
      medications: editingPatient?.medications || [],
      vitals: {
        hr: Number(form.heartRate),
        o2: Number(form.oxygen),
        bp: form.bloodPressure,
      },
    };

    if (editingPatient) {
      await updatePatient(patientData);
    } else {
      await addPatient(patientData);
    }

    setShowModal(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    await deletePatient(id);
  }

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage admitted patients and monitor status
          </p>
        </div>

        {user?.role === "ADMIN" ? (
          <button
            onClick={openAddModal}
            className="px-6 py-2 text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            + Add Patient
          </button>
        ) : (
          <div className="relative group">
            <button
              disabled
              className="px-6 py-2 text-white bg-gray-400 rounded-lg cursor-not-allowed"
            >
              Request Patient Admission
            </button>
            <span className="absolute px-3 py-1 text-xs text-white transition -translate-x-1/2 bg-black rounded opacity-0 -top-8 left-1/2 group-hover:opacity-100">
              Only Admin can add patients
            </span>
          </div>
        )}
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-6 transition bg-white border border-gray-200 shadow-sm cursor-pointer rounded-2xl hover:shadow-lg"
            onClick={() => router.push(`/dashboard/patients/${p.id}`)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {p.name}
                </h2>
                <p className="text-sm text-gray-500">{p.department}</p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  p.status === "Discharged"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {p.status}
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-700">
              <span className="font-medium">Diagnosis:</span> {p.diagnosis}
            </p>

            <p className="mt-2 text-sm">
              <span className="font-medium text-gray-700">Risk:</span>{" "}
              <span
                className={`font-semibold ${
                  p.risk === "Critical"
                    ? "text-red-600"
                    : p.risk === "High"
                    ? "text-orange-600"
                    : p.risk === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {p.risk}
              </span>
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 mt-6 text-sm text-center border-t">
              <div>
                <p className="text-xs text-gray-400">HR</p>
                <p className="font-semibold">{p.vitals?.hr}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">O2</p>
                <p className="font-semibold">{p.vitals?.o2}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">BP</p>
                <p className="font-semibold">{p.vitals?.bp}</p>
              </div>
            </div>

            <div
              className="flex gap-3 pt-6"
              onClick={(e) => e.stopPropagation()}
            >
              <RoleGuard allow={["ADMIN", "DOCTOR"]}>
                <button
                  onClick={() => openEditModal(p)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 transition border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"
                >
                  Edit
                </button>
              </RoleGuard>

              <RoleGuard allow={["ADMIN"]}>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-4 py-2 text-sm font-medium text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </RoleGuard>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal (unchanged logic) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-[680px] p-10 rounded-3xl shadow-2xl"
          >
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              {editingPatient ? "Edit Patient" : "Register New Patient"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  className="px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Diagnosis"
                required
                className="px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="risk"
                value={form.risk}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <div className="grid grid-cols-3 gap-6">
                <input
                  name="heartRate"
                  type="number"
                  value={form.heartRate}
                  onChange={handleChange}
                  placeholder="Heart Rate"
                  required
                  className="px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="oxygen"
                  type="number"
                  value={form.oxygen}
                  onChange={handleChange}
                  placeholder="Oxygen (%)"
                  required
                  className="px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="bloodPressure"
                  value={form.bloodPressure}
                  onChange={handleChange}
                  placeholder="Blood Pressure"
                  required
                  className="px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-2 text-white bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700"
                >
                  {editingPatient ? "Update Patient" : "Save Patient"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}