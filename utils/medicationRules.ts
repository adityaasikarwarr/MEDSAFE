/* =========================================================
   Medication Interaction Rules
   Used by: MedicationPage
   ========================================================= */

type InteractionRule = {
  meds: string[];
  message: string;
};

/* ================= INTERACTION DATABASE ================= */

const interactionRules: InteractionRule[] = [
  {
    meds: ["aspirin", "warfarin"],
    message: "Aspirin + Warfarin increases bleeding risk",
  },
  {
    meds: ["ibuprofen", "prednisone"],
    message: "Ibuprofen + Prednisone increases GI bleeding risk",
  },
  {
    meds: ["warfarin", "heparin"],
    message: "Warfarin + Heparin greatly increases bleeding risk",
  },
  {
    meds: ["metformin", "contrast dye"],
    message: "Metformin + Contrast Dye may increase lactic acidosis risk",
  },
];

/* =========================================================
   MAIN FUNCTION
   ========================================================= */

export function checkMedicationInteractions(meds: string[]): string[] {
  if (!meds || meds.length === 0) return [];

  /* Normalize medication names */
  const normalized = meds.map((m) => m.toLowerCase());

  const interactions: string[] = [];

  interactionRules.forEach((rule) => {
    const hasAllMeds = rule.meds.every((med) =>
      normalized.includes(med.toLowerCase())
    );

    if (hasAllMeds) {
      interactions.push(rule.message);
    }
  });

  return interactions;
}