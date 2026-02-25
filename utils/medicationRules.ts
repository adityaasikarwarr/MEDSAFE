export const dangerousCombinations = [
  ["Aspirin", "Warfarin"],
  ["Ibuprofen", "Prednisone"],
  ["Metformin", "Contrast Dye"],
];

export function checkMedicationInteractions(meds: string[]) {
  const alerts: string[] = [];

  dangerousCombinations.forEach(([drug1, drug2]) => {
    if (meds.includes(drug1) && meds.includes(drug2)) {
      alerts.push(`${drug1} + ${drug2} may cause severe complications`);
    }
  });

  return alerts;
}