import type { ChapterGenerationRequest } from "./schema";

export const unitsMeasurementsSpec: ChapterGenerationRequest = {
  globalId: 1,
  classLevel: 11,
  classOrder: 1,
  title: "Units and Measurements",
  slug: "units-measurements",

  examTracks: ["neet", "jee"],

  difficulty: "moderate",

  expectedQuestions: {
    neet: 50,
    jeeMain: 50,
    jeeAdvanced: 20,
  },

  learningObjectives: [
    "Understand physical quantities and measurement.",
    "Understand SI units and derived units.",
    "Use dimensional analysis to check physical equations.",
    "Apply error analysis and propagation of errors.",
    "Apply significant-figure rules correctly.",
    "Understand order of magnitude and estimation.",
    "Understand the working and least count of measuring instruments.",
    "Recognize common JEE and NEET traps.",
  ],

  importantTopics: [
    "Physical quantities",
    "SI units",
    "Fundamental and derived units",
    "Dimensions",
    "Dimensional analysis",
    "Errors",
    "Propagation of errors",
    "Significant figures",
    "Order of magnitude",
    "Vernier calipers",
    "Screw gauge",
    "PYQ patterns and exam traps",
  ],

  prerequisites: [
    "Basic algebra",
    "Powers and exponents",
    "Scientific notation",
  ],

  specialInstructions: [
    "Prioritize exam-oriented revision over textbook-style exposition.",
    "The mind map must be useful for a three-minute rapid revision.",
    "Concepts must contain practical exam recognition and common mistakes.",
    "Examples must demonstrate different reasoning patterns.",
    "Questions must be genuinely JEE/NEET level rather than elementary recall.",
    "Avoid repetitive questions.",
    "Numerical answers and dimensions must be independently checked.",
    "Use the existing PhysicsRishi content architecture.",
  ],
};
