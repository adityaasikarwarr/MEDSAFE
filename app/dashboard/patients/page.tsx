"use client";

import { useState, useMemo } from "react";
import { usePatients } from "@/context/PatientContext";
import { useAuth } from "@/context/AuthContext";
import { Patient } from "@/types/patient";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RoleGuard from "@/components/dashboard/RoleGuard";

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const { user } = useAuth();
  const router = useRouter();

  /* ================= FILTER STATE ================= */

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ================= MODAL STATE ================= */

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

  /* ================= FILTER LOGIC ================= */

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

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Patient Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
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

      {/* FILTERS */}
      <div className="grid gap-4 p-6 bg-white border border-gray-100 shadow rounded-2xl md:grid-cols-4">
        <input
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border outline-none rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
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

      {/* PATIENT GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPatients.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-6 transition bg-white border border-gray-200 shadow-sm cursor-pointer rounded-2xl hover:shadow-lg"
            onClick={() => router.push(`/dashboard/patients/${p.id}`)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {p.name}
                </h2>
                <p className="text-sm text-slate-500">{p.department}</p>
              </div>

              <span className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                {p.status}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-700">
              <span className="font-medium">Diagnosis:</span> {p.diagnosis}
            </p>

            <p className="mt-2 text-sm">
              <span className="font-medium text-slate-700">Risk:</span>{" "}
              <span className="font-semibold">{p.risk}</span>
            </p>

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

      {/* MODAL unchanged */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-[680px] p-10 rounded-3xl shadow-2xl"
          >
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              {editingPatient ? "Edit Patient" : "Register New Patient"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-600 border rounded-xl"
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
    </div>
  );
}

/* ================= DROPDOWN COMPONENT ================= */

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 transition border border-gray-200 bg-gray-50 rounded-xl hover:bg-gray-100"
      >
        <span className="text-sm text-gray-700">
          {label}: <span className="font-medium">{value}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl"
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition ${
                  option === value
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
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
