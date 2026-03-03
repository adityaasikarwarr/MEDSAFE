const STORAGE_KEY = "patientNotes";

export type Note = {
  id: number;
  patientId: number;
  role: "DOCTOR" | "NURSE" | "ADMIN";
  author: string;
  content: string;
  timestamp: number;
};

export const notesService = {
  async getAll(): Promise<Note[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async getByPatient(patientId: number): Promise<Note[]> {
    const all = await this.getAll();
    return all.filter((n) => n.patientId === patientId);
  },

  async add(note: Note): Promise<void> {
    const all = await this.getAll();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...all, note])
    );
  },
};