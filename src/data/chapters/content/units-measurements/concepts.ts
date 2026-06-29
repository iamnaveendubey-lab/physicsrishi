import type { ConceptCard } from "@/types/chapter";

export const unitsMeasurementsConcepts: ConceptCard[] = [
  { id: "quantities", title: "Physical Quantities", overview: "Quantifying parameters of nature.", body: "Every physical quantity is expressed as Q = n × u. They must be measurable. Intangible traits like thoughts, feelings, or beauty are not physical quantities." },
  { id: "si", title: "SI System of Units", overview: "The global measurement standard.", body: "Adopted in 1971 by CGPM. System consists of 7 Base units, 2 Supplementary units (Radian and Steradian), and infinite derived combinations." },
  { id: "fundamental", title: "Fundamental Units", overview: "The independent baseline variables.", body: "Base units form the fundamental coordinates of measurements: Mass [kg], Length [m], Time [s], Current [A], Temp [K], Intensity [cd], and Substance [mol]." },
  { id: "derived", title: "Derived Units", overview: "Interlocked unit systems.", body: "units produced by scaling base parameters. For example: Acceleration (m/s²), Pressure (N/m² or Pa), and Charge (A·s or Coulomb)." },
  { id: "dimensions", title: "Dimensions & Formulas", overview: "Power index coordinates of metrics.", body: "Forces, energies, and fields mapped by powers. Example: Force = [MLT⁻²], work = [ML²T⁻²]. Dimensionless metrics include angles, strain, and relative density." },
  { id: "figures", title: "Significant Figures", overview: "Accuracy index of physical limits.", body: "Significant figures verify precision limits. Non-zero values and sandwich zeros are significant. Leading zeros are disregarded." },
  { id: "error", title: "Error Analysis", overview: "Uncertainty calculations.", body: "Absolute Error: Δa = |a_mean - a_i|. Fractional Error: Δa/a. Percentage Error: (Δa/a) × 100%. Addition/Subtraction error propagates as sum of absolute errors." },
  { id: "analysis", title: "Dimensional Analysis", overview: "Principal formulas verifier.", body: "Uses the Principle of Homogeneity: dimensions on LHS must equal RHS. Quantities of different dimensions cannot be added or subtracted." },
];
