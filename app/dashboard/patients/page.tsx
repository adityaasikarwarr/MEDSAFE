"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";

type RiskType = "Critical" | "Medium" | "Low";
type StatusType = "Admitted" | "Stable";

type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: RiskType;
  status: StatusType;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    name: "",
    age: 0,
    department: "",
    risk: "Low",
    status: "Stable",
  });

  /* 🔥 Load patients from localStorage */
  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, []);

  /* 🔥 Save patients whenever they change */
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.department) return;

    if (editingPatient) {
      setPatients(
        patients.map((p) =>
          p.id === editingPatient.id ? { ...p, ...formData } : p,
        ),
      );
    } else {
      const newPatient: Patient = {
        id: Date.now(),
        ...formData,
      };
      setPatients([...patients, newPatient]);
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
    });
    setEditingPatient(null);
    setShowModal(false);
  };

  const deletePatient = (id: number) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  const editPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      department: patient.department,
      risk: patient.risk,
      status: patient.status,
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
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-white/20">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">
                {editingPatient ? "Edit Patient" : "Add Patient"}
              </h2>
              <button onClick={resetForm}>
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded-lg px-3 py-2 text-black"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Age"
              className="w-full border rounded-lg px-3 py-2  text-black"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: Number(e.target.value) })
              }
            />

            <input
              type="text"
              placeholder="Department"
              className="w-full border rounded-lg px-3 py-2 text-black"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />

            <select
              className="w-full border rounded-lg px-3 py-2 text-black"
              value={formData.risk}
              onChange={(e) =>
                setFormData({ ...formData, risk: e.target.value as RiskType })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              className="w-full border rounded-lg px-3 py-2 text-black"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as StatusType,
                })
              }
            >
              <option value="Stable">Stable</option>
              <option value="Admitted">Admitted</option>
            </select>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingPatient ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Risk Badge */
function RiskBadge({ risk }: { risk: RiskType }) {
  const styles =
    risk === "Critical"
      ? "bg-red-100 text-red-600"
      : risk === "Medium"
        ? "bg-yellow-100 text-yellow-600"
        : "bg-green-100 text-green-600";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles}`}>
      {risk}
    </span>
  );
}

/* Status Badge */
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
