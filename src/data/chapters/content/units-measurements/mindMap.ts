import type { MindMapConfig } from "@/types/chapter";

export const unitsMeasurementsMindMap: MindMapConfig = {
  centerLabel: "Units & Measurements",
  centerSubtitle: "Chapter 1 Core",
  nodes: [
    { id: "quantities", label: "Physical Quantities", x: "50%", y: "15%", details: "Any property of a material or phenomenon that can be measured and described numerically. Formulated as Q = n × u." },
    { id: "fundamental", label: "Fundamental Quantities", x: "20%", y: "30%", details: "Independent parameters representing the base units of SI. Includes Mass, Length, Time, Current, Temp, Luminous Intensity, and Mole." },
    { id: "derived", label: "Derived Quantities", x: "80%", y: "30%", details: "Quantities expressed by algebraically multiplying/dividing fundamental parameters. Example: Velocity, Force, Energy, Density." },
    { id: "units", label: "Units of Measure", x: "15%", y: "65%", details: "Standard parameters chosen as units. To convert systems: n₁u₁ = n₂u₂. Standard frameworks include SI, CGS, and MKS." },
    { id: "dimensions", label: "Dimensions", x: "85%", y: "65%", details: "Powers to which base SI parameters are raised to represent physical properties. Exponents represented inside brackets: [Mᵃ Lᵇ Tᶜ]." },
    { id: "figures", label: "Significant Figures", x: "35%", y: "85%", details: "Valid reliable digits in physical readings. Guided by decimal point locations, sandwich zeros, and scientific notation standards." },
    { id: "analysis", label: "Dimensional Analysis", x: "65%", y: "85%", details: "Applications of dimensional formulas to check mathematical homogeneity, convert units, and formulate physical equations." },
  ],
};
