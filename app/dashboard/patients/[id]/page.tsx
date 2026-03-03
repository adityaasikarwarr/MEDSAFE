"use client";

import { notesService, Note } from "@/services/notesService";
import { useAuth } from "@/context/AuthContext";
import { VitalsEntry } from "@/services/vitalsHistoryService";
import { vitalsHistoryService } from "@/services/vitalsHistoryService";
import RoleGuard from "@/components/dashboard/RoleGuard";
import { useParams, useRouter } from "next/navigation";
import { usePatients } from "@/context/PatientContext";
import { useEffect, useState } from "react";
import { Patient } from "@/types/patient";
import { motion } from "framer-motion";
import { activityService } from "@/services/activityService";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { patients, alerts, updatePatient } = usePatients();
  const { user } = useAuth();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [history, setHistory] = useState<VitalsEntry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");

  /* ================= Load Patient ================= */
  useEffect(() => {
    const found = patients.find((p) => String(p.id) === String(id));
    if (found) setPatient(found);
  }, [patients, id]);

  /* ================= Load Activities ================= */
  useEffect(() => {
    if (!patient) return;

    const loadActivities = async () => {
      const logs = await activityService.getAll();
      const related = logs.filter((log: any) =>
        log.description?.includes(patient.name),
      );
      setActivities(related.reverse());
    };

    loadActivities();
  }, [patient]);

  /* ================= Load Vitals History ================= */
  useEffect(() => {
    if (!patient) return;

    const loadHistory = async () => {
      const historyData = await vitalsHistoryService.getByPatient(patient.id);
      setHistory(historyData.slice(-10));
    };

    loadHistory();
  }, [patient]);

  /* ================= Load Notes ================= */
  useEffect(() => {
    if (!patient) return;

    const loadNotes = async () => {
      const patientNotes = await notesService.getByPatient(patient.id);
      setNotes(patientNotes.reverse());
    };

    loadNotes();
  }, [patient]);

  if (!patient) {
    return <div className="p-8 text-gray-500">Patient not found.</div>;
  }

  const relatedAlerts = alerts.filter((a) => a.message.includes(patient.name));

  /* ================= Discharge ================= */
  async function dischargePatient() {
    await updatePatient({ ...patient, status: "Discharged" });
    router.push("/dashboard/patients");
  }

  /* ================= Add Note ================= */
  async function handleAddNote() {
    if (!noteInput.trim() || !user || !patient) return;

    await notesService.add({
      id: Date.now(),
      patientId: patient.id,
      role: user.role,
      author: user.name,
      content: noteInput,
      timestamp: Date.now(),
    });

    const updated = await notesService.getByPatient(patient.id);
    setNotes(updated.reverse());
    setNoteInput("");
  }

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-500">{patient.department}</p>
        </div>

        <div className="flex gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              patient.risk === "Critical"
                ? "bg-red-100 text-red-600"
                : patient.risk === "High"
                  ? "bg-orange-100 text-orange-600"
                  : patient.risk === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
            }`}
          >
            {patient.risk}
          </span>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              patient.status === "Discharged"
                ? "bg-gray-100 text-gray-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {patient.status}
          </span>
        </div>
      </div>

      {/* Profile */}
      <div className="grid grid-cols-3 gap-6 p-6 bg-white border shadow rounded-2xl">
        <Info label="Age" value={patient.age} />
        <Info label="Gender" value={patient.gender} />
        <Info label="Diagnosis" value={patient.diagnosis} />
      </div>

      {/* Current Vitals */}
      <div className="p-6 space-y-6 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Current Vitals</h2>

        <div className="grid grid-cols-3 gap-6">
          <VitalCard label="Heart Rate" value={`${patient.vitals.hr} bpm`} />
          <VitalCard label="Oxygen" value={`${patient.vitals.o2}%`} />
          <VitalCard label="Blood Pressure" value={patient.vitals.bp} />
        </div>
      </div>

      {/* Vitals History */}
      <div className="p-6 bg-white border shadow rounded-2xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Heart Rate Trend
        </h2>

        <div className="flex items-end h-32 gap-2">
          {history.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${entry.hr}px` }}
              transition={{ duration: 0.4 }}
              className="flex-1 bg-blue-500 rounded"
            />
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="p-6 space-y-4 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Related Alerts</h2>

        {relatedAlerts.length === 0 && (
          <p className="text-sm text-gray-500">No alerts for this patient.</p>
        )}

        {relatedAlerts.map((alert) => (
          <div key={alert.id} className="py-2 pl-4 border-l-4 border-red-500">
            <p className="text-sm font-medium text-gray-800">{alert.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="p-6 space-y-4 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">
          Activity History
        </h2>

        {activities.length === 0 && (
          <p className="text-sm text-gray-500">No recorded activity.</p>
        )}

        {activities.map((act) => (
          <div key={act.id} className="text-sm">
            <p className="font-medium text-gray-800">{act.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(act.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Clinical Notes */}
      <div className="p-6 space-y-4 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Clinical Notes</h2>

        {notes.length === 0 && (
          <p className="text-sm text-gray-500">No notes recorded.</p>
        )}

        {notes.map((note) => (
          <div key={note.id} className="pb-3 border-b">
            <p className="text-sm text-gray-800">{note.content}</p>
            <p className="mt-1 text-xs text-gray-500">
              {note.role} • {note.author} •{" "}
              {new Date(note.timestamp).toLocaleString()}
            </p>
          </div>
        ))}

        {(user?.role === "DOCTOR" ||
          user?.role === "NURSE" ||
          user?.role === "ADMIN") && (
          <div className="flex gap-3 pt-4">
            <input
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add clinical note..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddNote}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Discharge */}
      {patient.status !== "Discharged" && (
        <RoleGuard allow={["ADMIN", "DOCTOR"]}>
          <button
            onClick={dischargePatient}
            className="px-6 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
          >
            Discharge Patient
          </button>
        </RoleGuard>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function VitalCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-4 border bg-gray-50 rounded-xl"
    >
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </motion.div>
  );
}
