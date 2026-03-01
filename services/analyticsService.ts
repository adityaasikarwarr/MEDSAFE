"use client";

export const analyticsService = {
  async getPatientVitalsHistory(patientId: string) {
    // Mock for now (replace with backend later)
    return [
      { value: 82 },
      { value: 88 },
      { value: 91 },
      { value: 95 },
      { value: 98 },
    ];
  },
};