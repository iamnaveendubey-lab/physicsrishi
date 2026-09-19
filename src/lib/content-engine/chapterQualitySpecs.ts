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
export const MOTION_1D_QUALITY_SPEC: ChapterQualitySpec = {
  requiredTopics: [
    "Position and reference point",
    "Distance and displacement",
    "Speed and velocity",
    "Average speed",
    "Average velocity",
    "Instantaneous velocity",
    "Acceleration",
    "Uniform motion",
    "Uniformly accelerated motion",
    "Equations of motion",
    "Position-time graphs",
    "Velocity-time graphs",
    "Acceleration-time graphs",
    "Graphical interpretation of motion",
    "Motion with variable acceleration",
    "Piecewise motion",
    "Relative motion in one dimension",
    "Free-fall",
    "PYQ",
  ],

  minimumConcepts: 8,
  minimumFormulas: 6,
  minimumExamples: 6,
  maximumExamples: 10,
  conceptQuestions: 15,
  competitionQuestions: 50,
  minimumMindMapNodes: 7,
  maximumMindMapNodes: 10,
};
//chapter quality specs for motion in 2D
export const MOTION_2D_QUALITY_SPEC: ChapterQualitySpec = {
  requiredTopics: [
    "Scalars and vectors",
    "Vector representation",
    "Vector addition and subtraction",
    "Resolution of vectors into components",
    "Unit vectors",
    "Position vector",
    "Displacement vector",
    "Velocity vector",
    "Acceleration vector",
    "Relative velocity",
    "Projectile motion",
    "Horizontal and vertical components of projectile motion",
    "Time of flight",
    "Maximum height",
    "Horizontal range",
    "Projectile trajectory",
    "Projectile from an elevated point",
    "Uniform circular motion",
    "Centripetal acceleration",
    "PYQ",
  ],

  minimumConcepts: 8,
  minimumFormulas: 8,
  minimumExamples: 6,
  maximumExamples: 10,
  conceptQuestions: 15,
  competitionQuestions: 50,
  minimumMindMapNodes: 7,
  maximumMindMapNodes: 10,
};
export const LAWS_OF_MOTION_QUALITY_SPEC: ChapterQualitySpec = {
  requiredTopics: [
    "Force and its vector nature",
    "Newton's first law",
    "Inertia",
    "Newton's second law",
    "Momentum and force",
    "Newton's third law",
    "Action-reaction pairs",
    "Free-body diagrams",
    "Common forces",
    "Normal reaction",
    "Tension",
    "Friction",
    "Static friction",
    "Limiting friction",
    "Kinetic friction",
    "Coefficient of friction",
    "Angle of friction",
    "Angle of repose",
    "Motion on a rough horizontal surface",
    "Motion on a rough inclined plane",
    "Connected bodies",
    "String and pulley systems",
    "Equilibrium",
    "Multiple-force systems",
    "Inertial and non-inertial frames",
    "Pseudo force",
    "PYQ patterns and exam traps",
  ],

  minimumConcepts: 8,
  minimumFormulas: 8,
  minimumExamples: 6,
  maximumExamples: 10,
  conceptQuestions: 15,
  competitionQuestions: 50,
  minimumMindMapNodes: 7,
  maximumMindMapNodes: 10,
};
