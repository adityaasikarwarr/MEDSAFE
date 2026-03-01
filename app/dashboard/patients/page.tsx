"use client";

import { usePatients } from "@/context/PatientContext";
import { useAuth } from "@/context/AuthContext";
import { getPermissions } from "@/engine/permissionEngine";
import type { Patient, Severity } from "@/types/patient";
import { useState } from "react";
import { Search, Plus, X } from "lucide-react";

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const { user } = useAuth();
  const permissions = user ? getPermissions(user.role) : null;

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);

  const initialForm: Omit<Patient, "id"> = {
    name: "",
    age: 0,
    department: "",
    diagnosis: "",
    bedNumber: "",
    heartRate: 80,
    oxygenLevel: 98,
    bloodPressure: "120/80",
    risk: "Low",
    status: "Stable",
    admittedAt: new Date().toISOString(),
    assignedDoctor: "",
    medications: [],
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.department) return;

    if (editingPatientId !== null) {
      await updatePatient({
        id: editingPatientId,
        ...formData,
      });
    } else {
      await addPatient({
        id: Date.now(),
        ...formData,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingPatientId(null);
    setShowModal(false);
  };

  const editPatient = (patient: Patient) => {
    if (!permissions?.canEditPatient) return;

    setEditingPatientId(patient.id);
    setFormData({ ...patient });
    setShowModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
            <p className="text-gray-500">ICU & Department Patient Management</p>
          </div>

          {permissions?.canEditPatient && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white transition shadow bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:opacity-90"
            >
              <Plus size={16} />
              Add Patient
            </button>
          )}
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-3 p-4 bg-white shadow rounded-xl">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden bg-white shadow rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Bed</th>
                <th className="p-4">Heart Rate</th>
                <th className="p-4">O₂</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{patient.name}</td>
                    <td className="p-4">{patient.bedNumber}</td>
                    <td className="p-4">{patient.heartRate}</td>
                    <td className="p-4">{patient.oxygenLevel}%</td>
                    <td className="p-4">
                      <RiskBadge risk={patient.risk} />
                    </td>
                    <td className="p-4 space-x-3">
                      {permissions?.canEditPatient && (
                        <button
                          onClick={() => editPatient(patient)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      )}

                      {permissions?.canDeletePatient && (
                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && permissions?.canEditPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingPatientId ? "Edit Patient" : "Add Patient"}
              </h2>
              <button onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />

              <Input
                type="number"
                label="Age"
                value={String(formData.age)}
                onChange={(v) => setFormData({ ...formData, age: Number(v) })}
              />

              <Input
                label="Department"
                value={formData.department}
                onChange={(v) => setFormData({ ...formData, department: v })}
              />

              <Input
                label="Diagnosis"
                value={formData.diagnosis}
                onChange={(v) => setFormData({ ...formData, diagnosis: v })}
              />

              <Input
                label="ICU Bed"
                value={formData.bedNumber}
                onChange={(v) => setFormData({ ...formData, bedNumber: v })}
              />

              <Input
                label="Assigned Doctor"
                value={formData.assignedDoctor}
                onChange={(v) =>
                  setFormData({ ...formData, assignedDoctor: v })
                }
              />

              <Input
                type="number"
                label="Heart Rate"
                value={String(formData.heartRate)}
                onChange={(v) =>
                  setFormData({ ...formData, heartRate: Number(v) })
                }
              />

              <Input
                type="number"
                label="Oxygen Level"
                value={String(formData.oxygenLevel)}
                onChange={(v) =>
                  setFormData({ ...formData, oxygenLevel: Number(v) })
                }
              />

              <Input
                label="Blood Pressure"
                value={formData.bloodPressure}
                onChange={(v) => setFormData({ ...formData, bloodPressure: v })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Risk Level"
                value={formData.risk}
                options={["Low", "Medium", "High", "Critical"]}
                onChange={(v) =>
                  setFormData({ ...formData, risk: v as Severity })
                }
              />

              <Select
                label="Status"
                value={formData.status}
                options={["Stable", "Admitted", "Critical"]}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    status: v as Patient["status"],
                  })
                }
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 font-medium text-white transition bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:opacity-90"
            >
              {editingPatientId ? "Update Patient" : "Add Patient"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function RiskBadge({ risk }: { risk: Severity }) {
  const styles =
    risk === "Critical"
      ? "bg-red-100 text-red-600"
      : risk === "High"
        ? "bg-orange-100 text-orange-600"
        : risk === "Medium"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-green-100 text-green-600";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles}`}>
      {risk}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 transition border outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 transition border outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
