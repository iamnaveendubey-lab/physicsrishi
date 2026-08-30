export interface ChapterQualitySpec {
  requiredTopics: string[];
  minimumConcepts: number;
  minimumFormulas: number;
  minimumExamples: number;
  maximumExamples: number;
  conceptQuestions: number;
  competitionQuestions: number;
  minimumMindMapNodes: number;
  maximumMindMapNodes: number;
  forbiddenPhrases?: string[];
}

export const UNITS_MEASUREMENTS_QUALITY_SPEC: ChapterQualitySpec = {
  requiredTopics: [
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
    "PYQ traps",
  ],

  minimumConcepts: 8,

  minimumFormulas: 6,

  minimumExamples: 6,
  maximumExamples: 10,

  conceptQuestions: 15,

  competitionQuestions: 50,

  minimumMindMapNodes: 7,
  maximumMindMapNodes: 10,

  forbiddenPhrases: ["2 supplementary units", "two supplementary units"],
};
