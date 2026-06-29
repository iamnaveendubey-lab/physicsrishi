import type { FormulaEntry } from "@/types/chapter";

export const unitsMeasurementsFormulas: FormulaEntry[] = [
  { id: "formula_1", title: "Dimensional Formulas Reference", code: "[Force] = [MLT⁻²] \n[Energy] = [ML²T⁻²] \n[Planck's Constant] = [ML²T⁻¹] \n[Gravitational Constant G] = [M⁻¹L³T⁻²]" },
  { id: "formula_2", title: "Percentage Error Relations", code: "If P = aˣ bʸ / cᶻ \nMaximum Fractional Error:\nΔP/P = x(Δa/a) + y(Δb/b) + z(Δc/c)\nMaximum Percentage Error:\n(ΔP/P)% = x(Δa/a)% + y(Δb/b)% + z(Δc/c)%" },
  { id: "formula_3", title: "Significant Figures Rules", code: "1. All non-zero digits are significant.\n2. Zeros between non-zero digits are significant.\n3. Leading zeros are NEVER significant.\n4. Trailing zeros after decimal are significant." },
  { id: "formula_4", title: "Error Propagation Formulae", code: "Sum (Z = A + B) ⇒ ΔZ = ΔA + ΔB\nDifference (Z = A - B) ⇒ ΔZ = ΔA + ΔB\nProduct (Z = A × B) ⇒ ΔZ/Z = ΔA/A + ΔB/B\nQuotient (Z = A / B) ⇒ ΔZ/Z = ΔA/A + ΔB/B" },
];
