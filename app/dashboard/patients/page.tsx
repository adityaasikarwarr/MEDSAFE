"use client";

import { usePatients } from "@/context/PatientContext";
import type { Severity, Patient } from "@/context/PatientContext";
import { useState } from "react";
import { Search, Plus, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StatusType = "Admitted" | "Stable";

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    name: "",
    age: 0,
    department: "",
    risk: "Low",
    status: "Stable",
    medications: [],
  });

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.department) return;

    if (editingPatientId !== null) {
      updatePatient({
        id: editingPatientId,
        ...formData,
      });
    } else {
      addPatient({
        id: Date.now(),
        ...formData,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: 0,
      department: "",
      risk: "Low",
      status: "Stable",
      medications: [],
    });
    setEditingPatientId(null);
    setShowModal(false);
  };

  const editPatient = (patient: Patient) => {
    setEditingPatientId(patient.id);
    setFormData({
      name: patient.name,
      age: patient.age,
      department: patient.department,
      risk: patient.risk,
      status: patient.status,
      medications: patient.medications || [],
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500">Manage and monitor patients</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
        <Search className="text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full text-black"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Age</th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Department
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">Risk</th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">
                    {patient.name}
                  </td>
                  <td className="p-4">{patient.age}</td>
                  <td className="p-4">{patient.department}</td>
                  <td className="p-4">
                    <RiskBadge risk={patient.risk} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={patient.status} />
                  </td>
                  <td className="p-4 space-x-3">
                    <button
                      onClick={() => editPatient(patient)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePatient(patient.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-900">
                {editingPatientId !== null ? "Edit Patient" : "Add Patient"}
              </h2>
              <button onClick={resetForm}>
                <X size={18} className="text-black" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 transition"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Age"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 transition"
              value={formData.age}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  age: Number(e.target.value),
                })
              }
            />

            <input
              type="text"
              placeholder="Department"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 transition"
              value={formData.department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  department: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Medications (comma separated)"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 transition"
              value={formData.medications.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  medications: e.target.value
                    .split(",")
                    .map((m) => m.trim())
                    .filter(Boolean),
                })
              }
            />

            <CustomSelect
              value={formData.risk}
              options={["Low", "Medium", "High", "Critical"]}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  risk: val as Severity,
                })
              }
            />

            <CustomSelect
              value={formData.status}
              options={["Stable", "Admitted"]}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  status: val as StatusType,
                })
              }
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingPatientId !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

function StatusBadge({ status }: { status: StatusType }) {
  const styles =
    status === "Admitted"
      ? "bg-blue-100 text-blue-600"
      : "bg-green-100 text-green-600";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles}`}>
      {status}
    </span>
  );
}

function CustomSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 transition text-black"
      >
        <span>{value}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden text-black"
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition"
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
