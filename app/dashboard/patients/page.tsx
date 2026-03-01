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

    setFormData({
      name: patient.name,
      age: patient.age,
      department: patient.department,
      diagnosis: patient.diagnosis,
      bedNumber: patient.bedNumber,
      heartRate: patient.heartRate,
      oxygenLevel: patient.oxygenLevel,
      bloodPressure: patient.bloodPressure,
      risk: patient.risk,
      status: patient.status,
      admittedAt: patient.admittedAt,
      assignedDoctor: patient.assignedDoctor,
      medications: patient.medications || [],
    });

    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500">Manage and monitor patients</p>
        </div>

        {permissions?.canEditPatient && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Patient
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 p-4 bg-white shadow rounded-xl">
        <Search className="text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-black outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden bg-white shadow rounded-xl">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Bed</th>
              <th className="p-4 text-sm font-semibold text-gray-600">HR</th>
              <th className="p-4 text-sm font-semibold text-gray-600">O₂</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Risk</th>
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

      {/* MODAL */}
      {showModal && permissions?.canEditPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg">
          <div className="p-6 space-y-4 bg-white border border-gray-200 shadow-2xl rounded-2xl w-96">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingPatientId ? "Edit Patient" : "Add Patient"}
              </h2>
              <button onClick={resetForm}>
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="ICU Bed"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              value={formData.bedNumber}
              onChange={(e) =>
                setFormData({ ...formData, bedNumber: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Heart Rate"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              value={formData.heartRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heartRate: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              placeholder="Oxygen Level"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              value={formData.oxygenLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  oxygenLevel: Number(e.target.value),
                })
              }
            />

            <button
              onClick={handleSubmit}
              className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {editingPatientId ? "Update" : "Add"}
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
