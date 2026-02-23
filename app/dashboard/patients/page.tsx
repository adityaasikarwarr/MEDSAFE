"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: "Critical" | "Medium" | "Low";
  status: "Admitted" | "Stable";
};

const initialPatients: Patient[] = [
  { id: 1, name: "Daniel Anderson", age: 67, department: "ICU", risk: "Critical", status: "Admitted" },
  { id: 2, name: "Sophia Lee", age: 45, department: "General Ward", risk: "Medium", status: "Admitted" },
  { id: 3, name: "Michael Chen", age: 52, department: "ICU", risk: "Low", status: "Stable" },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const deletePatient = (id: number) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500">Manage and monitor all patients</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
        <Search className="text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Age</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Department</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Risk</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{patient.id}</td>
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
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                  <button
                    onClick={() => deletePatient(patient.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No patients found.
          </div>
        )}
      </div>
    </div>
  );
}

/* Risk Badge */
function RiskBadge({ risk }: { risk: string }) {
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
function StatusBadge({ status }: { status: string }) {
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