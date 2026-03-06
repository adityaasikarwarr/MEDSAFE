"use client";

import { useState, useMemo } from "react";
import { usePatients } from "@/context/PatientContext";
import { useAuth } from "@/context/AuthContext";
import { Patient } from "@/types/patient";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RoleGuard from "@/components/dashboard/RoleGuard";
import StatusCard from "@/components/ui/StatusCard";
import toast from "react-hot-toast";

export default function PatientsPage() {
  const { patients, loading, addPatient, updatePatient, deletePatient } =
    usePatients();

  const { user } = useAuth();
  const router = useRouter();

  const inputStyle =
    "w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  /* ================= FILTER STATE ================= */

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ================= MODAL ================= */

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const emptyForm = {
    name: "",
    age: "",
    gender: "Male",
    department: "ICU",
    diagnosis: "",
    risk: "Low",
    medications: "",
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
      medications: patient.medications?.join(", ") || "",
      heartRate: patient.vitals?.hr || "",
      oxygen: patient.vitals?.o2 || "",
      bloodPressure: patient.vitals?.bp || "",
    });

    setShowModal(true);
  }

  /* ================= SUBMIT ================= */

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
      medications: form.medications
        ? form.medications.split(",").map((m: string) => m.trim())
        : [],

      vitals: {
        hr: Number(form.heartRate),
        o2: Number(form.oxygen),
        bp: form.bloodPressure,
      },
    };

    if (editingPatient) {
      await updatePatient(patientData);
      toast.success("Patient updated");
    } else {
      await addPatient(patientData);
      toast.success("Patient added");
    }

    setShowModal(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this patient?")) return;

    await deletePatient(id);
    toast.success("Patient deleted");
  }

  /* ================= FILTER ================= */

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

      const matchesRisk = riskFilter === "All" || p.risk === riskFilter;

      const matchesDepartment =
        departmentFilter === "All" || p.department === departmentFilter;

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;

      return matchesSearch && matchesRisk && matchesDepartment && matchesStatus;
    });
  }, [patients, search, riskFilter, departmentFilter, statusFilter]);

  const departments = [...new Set(patients.map((p) => p.department))];

  if (loading) {
    return (
      <StatusCard
        title="Loading Patients..."
        description="Fetching hospital data..."
      />
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Patient Management
          </h1>

          <p className="text-slate-500">
            Manage admitted patients and monitor status
          </p>
        </div>

        {user?.role === "ADMIN" && (
          <button
            onClick={openAddModal}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            + Add Patient
          </button>
        )}
      </div>

      {/* FILTERS */}

      <div className="grid gap-4 p-6 bg-white border border-gray-200 shadow-sm rounded-2xl md:grid-cols-4">
        <input
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        <FilterDropdown
          label="Risk"
          value={riskFilter}
          options={["All", "Low", "Medium", "High", "Critical"]}
          onChange={setRiskFilter}
        />

        <FilterDropdown
          label="Department"
          value={departmentFilter}
          options={["All", ...departments]}
          onChange={setDepartmentFilter}
        />

        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={["All", "Admitted", "Discharged"]}
          onChange={setStatusFilter}
        />
      </div>

      {/* EMPTY */}

      {filteredPatients.length === 0 && (
        <StatusCard
          title="No Patients Found"
          description="No patients match your filters"
        />
      )}

      {/* PATIENT GRID */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPatients.map((p) => {
          const riskColor =
            p.risk === "Critical"
              ? "bg-red-500"
              : p.risk === "High"
                ? "bg-orange-400"
                : p.risk === "Medium"
                  ? "bg-yellow-400"
                  : "bg-green-400";

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative p-6 overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-lg"
              onClick={() => router.push(`/dashboard/patients/${p.id}`)}
            >
              {/* Risk indicator */}
              <div
                className={`absolute left-0 top-0 h-full w-1 ${
                  p.risk === "Critical"
                    ? "bg-red-500"
                    : p.risk === "High"
                      ? "bg-orange-500"
                      : p.risk === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                }`}
              />

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {p.name}
                  </h2>

                  <p className="text-sm text-slate-500">{p.department}</p>
                </div>

                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  {p.status}
                </span>
              </div>

              {/* Diagnosis */}
              <p className="mt-4 text-sm text-slate-700">
                <span className="font-medium">Diagnosis:</span> {p.diagnosis}
              </p>

              {/* Vitals */}
              <div className="grid grid-cols-3 gap-4 mt-5 text-center">
                <div>
                  <p className="text-xs text-slate-500">HR</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {p.vitals?.hr ?? "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">O2</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {p.vitals?.o2 ?? "--"}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">BP</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {p.vitals?.bp ?? "--"}
                  </p>
                </div>
              </div>

              {/* Risk */}
              <div className="mt-5 text-sm">
                <span className="text-slate-500">Risk: </span>

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
              </div>

              {/* Actions */}
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
          );
        })}
      </div>

      {/* MODAL */}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[720px] p-10 rounded-3xl shadow-2xl"
            >
              <h2 className="mb-6 text-2xl font-semibold text-black">
                {editingPatient ? "Edit Patient" : "Register New Patient"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={inputStyle}
                  />

                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Age"
                    className={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option>ICU</option>
                    <option>Emergency</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>General Ward</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Medications
                  </label>

                  <input
                    name="medications"
                    value={form.medications}
                    onChange={handleChange}
                    placeholder="Medications"
                    className={inputStyle}
                  />
                </div>

                <input
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  placeholder="Diagnosis"
                  className={inputStyle}
                />

                <select
                  name="risk"
                  value={form.risk}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>

                <div className="grid grid-cols-3 gap-5">
                  <input
                    name="heartRate"
                    type="number"
                    value={form.heartRate}
                    onChange={handleChange}
                    placeholder="Heart Rate"
                    className={inputStyle}
                  />

                  <input
                    name="oxygen"
                    type="number"
                    value={form.oxygen}
                    onChange={handleChange}
                    placeholder="Oxygen %"
                    className={inputStyle}
                  />

                  <input
                    name="bloodPressure"
                    value={form.bloodPressure}
                    onChange={handleChange}
                    placeholder="Blood Pressure"
                    className={inputStyle}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-black border rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-2 text-white bg-blue-600 rounded-xl"
                  >
                    {editingPatient ? "Update Patient" : "Save Patient"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= BADGES ================= */

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-3 py-1 text-xs text-green-600 bg-green-100 rounded-full">
      {status}
    </span>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const color =
    risk === "Critical"
      ? "text-red-600"
      : risk === "High"
        ? "text-orange-600"
        : risk === "Medium"
          ? "text-yellow-600"
          : "text-green-600";

  return <span className={`font-semibold ${color}`}>{risk}</span>;
}

/* ================= DROPDOWN ================= */

function FilterDropdown({ label, value, options, onChange }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
      >
        <span className="text-sm">
          {label}: <span className="font-medium">{value}</span>
        </span>

        <span className="text-gray-500">▼</span>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl rounded-xl">
          {options.map((option: string) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer

${
  option === value
    ? "bg-blue-100 text-blue-600 font-medium"
    : "text-gray-700 hover:bg-blue-50"
}
`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
