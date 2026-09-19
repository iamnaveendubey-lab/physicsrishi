import {
  UNITS_MEASUREMENTS_QUALITY_SPEC,
  MOTION_1D_QUALITY_SPEC,
  MOTION_2D_QUALITY_SPEC,
  LAWS_OF_MOTION_QUALITY_SPEC,
} from "./chapterQualitySpecs";
import type { ChapterContentBundle } from "@/types/chapter";

export interface QualityValidationResult {
  valid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
}

export function validateChapterQuality(
  chapter: ChapterContentBundle,
): QualityValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const qualitySpec =
    chapter.meta.globalId === 4
      ? LAWS_OF_MOTION_QUALITY_SPEC
      : chapter.meta.globalId === 3
        ? MOTION_2D_QUALITY_SPEC
        : chapter.meta.globalId === 2
          ? MOTION_1D_QUALITY_SPEC
          : UNITS_MEASUREMENTS_QUALITY_SPEC;
  // ------------------------------------------
  // 1. BASIC CHAPTER CHECK
  // ------------------------------------------

  if (!chapter.meta.title?.trim()) {
    errors.push("Chapter title is missing.");
  }

  if (!chapter.meta.slug?.trim()) {
    errors.push("Chapter slug is missing.");
  }

  // ------------------------------------------
  // 2. MIND MAP
  // ------------------------------------------

  const mindMapNodes = chapter.mindMap?.nodes ?? [];

  if (mindMapNodes.length === 0) {
    errors.push("Mind map contains no nodes.");
  }

  if (mindMapNodes.length > 10) {
    errors.push(
      `Mind map contains ${mindMapNodes.length} nodes. Maximum allowed is 10.`,
    );
  }

  if (mindMapNodes.length < 6) {
    warnings.push(
      `Mind map contains only ${mindMapNodes.length} nodes. Gold Standard target is 6–10.`,
    );
  }

  // ------------------------------------------
  // 3. CONCEPTS
  // ------------------------------------------

  const concepts = chapter.concepts ?? [];

  if (concepts.length < 6) {
    warnings.push(
      `Only ${concepts.length} concepts generated. Gold Standard target is at least 6.`,
    );
  }

  for (const concept of concepts) {
    if (!concept.title?.trim()) {
      errors.push(`Concept ${concept.id} is missing a title.`);
    }

    if (!concept.overview?.trim()) {
      errors.push(`Concept ${concept.id} is missing an overview.`);
    }

    if (!concept.body?.trim()) {
      errors.push(`Concept ${concept.id} is missing its main explanation.`);
    }
  }

  // ------------------------------------------
  // 4. FORMULAS
  // ------------------------------------------

  const formulas = chapter.formulas ?? [];

  if (formulas.length === 0) {
    warnings.push("No formulas were generated.");
  }

  for (const formula of formulas) {
    if (!formula.title?.trim()) {
      errors.push(`Formula ${formula.id} is missing a title.`);
    }

    if (!formula.code?.trim()) {
      errors.push(`Formula ${formula.id} is missing formula content.`);
    }
  }

  // ------------------------------------------
  // 5. SOLVED EXAMPLES
  // ------------------------------------------

  const examples = chapter.examples ?? [];

  if (examples.length < qualitySpec.minimumExamples) {
    errors.push(
      `Only ${examples.length} solved examples generated. Minimum required is 5.`,
    );
  }

  if (examples.length > qualitySpec.maximumExamples) {
    errors.push(
      `${examples.length} solved examples generated. Maximum allowed is 10.`,
    );
  }

  for (const example of examples) {
    if (!example.question?.trim()) {
      errors.push(`Example ${example.id} is missing a question.`);
    }

    if (!example.options || example.options.length !== 4) {
      errors.push(`Example ${example.id} must contain exactly 4 options.`);
    }

    if (!example.correct?.trim()) {
      errors.push(`Example ${example.id} is missing the correct answer.`);
    }

    if (!example.solution?.trim()) {
      errors.push(`Example ${example.id} is missing a solution.`);
    }
  }

  // ------------------------------------------
  // 6. CONCEPT QUIZ
  // ------------------------------------------

  const conceptQuestions = chapter.quizzes?.concept ?? [];

  if (conceptQuestions.length !== 15) {
    errors.push(
      `Concept quiz must contain exactly 15 questions. Found ${conceptQuestions.length}.`,
    );
  }

  // ------------------------------------------
  // 7. COMPETITION TEST
  // ------------------------------------------

  const competitionQuestions = chapter.quizzes?.competition ?? [];

  if (competitionQuestions.length !== 50) {
    errors.push(
      `Competition test must contain exactly 50 questions. Found ${competitionQuestions.length}.`,
    );
  }

  // ------------------------------------------
  // 8. QUESTION QUALITY STRUCTURE
  // ------------------------------------------

  const allQuestions = [...conceptQuestions, ...competitionQuestions];

  for (const question of allQuestions) {
    if (!question.question?.trim()) {
      errors.push(`Question ${question.id} is missing question text.`);
    }

    if (!question.options || question.options.length !== 4) {
      errors.push(`Question ${question.id} must contain exactly 4 options.`);
    }

    if (
      typeof question.correctIndex !== "number" ||
      question.correctIndex < 0 ||
      question.correctIndex > 3
    ) {
      errors.push(`Question ${question.id} has an invalid correctIndex.`);
    }

    if (!question.explanation?.trim()) {
      errors.push(`Question ${question.id} is missing an explanation.`);
    }
  }

  // ------------------------------------------
  // 9. DUPLICATE QUESTION DETECTION
  // ------------------------------------------

  const normalizedQuestions = allQuestions
    .map((q) => q.question.trim().toLowerCase())
    .filter(Boolean);

  const uniqueQuestions = new Set(normalizedQuestions);

  if (uniqueQuestions.size !== normalizedQuestions.length) {
    errors.push("Duplicate questions detected.");
  }

  // ------------------------------------------
  // 10. SCORE
  // ------------------------------------------

  const totalChecks =
    10 +
    concepts.length +
    formulas.length +
    examples.length +
    allQuestions.length;

  const failedChecks = errors.length;

  const score =
    totalChecks === 0
      ? 0
      : Math.max(
          0,
          Math.round(((totalChecks - failedChecks) / totalChecks) * 100),
        );
  // ------------------------------------------
  // 11. CHAPTER TOPIC COVERAGE
  // ------------------------------------------

  const searchableContent = [
    chapter.meta.title,
    chapter.mindMap.centerLabel,
    chapter.mindMap.centerSubtitle,

    ...mindMapNodes.flatMap((node) => [node.label, node.details]),

    ...concepts.flatMap((concept) => [
      concept.title,
      concept.overview,
      concept.body,
    ]),

    ...formulas.flatMap((formula) => [formula.title, formula.code]),

    ...examples.flatMap((example) => [example.question, example.solution]),

    ...allQuestions.flatMap((question) => [
      question.question,
      question.explanation,
      ...question.options,
    ]),
  ]
    .join(" ")
    .toLowerCase();

  for (const topic of qualitySpec.requiredTopics) {
    const topicLower = topic.toLowerCase();

    // Allow semantically equivalent terminology for known topics.
    const topicAliases: Record<string, string[]> = {
      "fundamental and derived units": [
        "fundamental units",
        "derived units",
        "fundamental unit",
        "derived unit",
        "base units",
        "si base units",
        "si derived units",
      ],

      "position and reference point": [
        "position",
        "reference point",
        "reference frame",
        "origin",
      ],

      "distance and displacement": ["distance", "displacement"],

      "speed and velocity": ["speed", "velocity"],

      "average speed": ["average speed"],

      "average velocity": ["average velocity"],

      "instantaneous velocity": ["instantaneous velocity"],

      "uniform motion": ["uniform motion", "constant velocity"],

      "uniformly accelerated motion": [
        "uniformly accelerated motion",
        "constant acceleration",
      ],

      "equations of motion": [
        "equations of motion",
        "kinematic equations",
        "kinematics equations",
      ],

      "position-time graphs": [
        "position-time graph",
        "position time graph",
        "x-t graph",
      ],

      "velocity-time graphs": [
        "velocity-time graph",
        "velocity time graph",
        "v-t graph",
      ],

      "acceleration-time graphs": [
        "acceleration-time graph",
        "acceleration time graph",
        "a-t graph",
      ],

      "motion with variable acceleration": [
        "variable acceleration",
        "varying acceleration",
      ],

      "piecewise motion": [
        "piecewise motion",
        "piecewise",
        "multi-stage motion",
      ],

      "relative motion in one dimension": [
        "relative motion",
        "relative velocity",
      ],

      "free-fall": ["free fall", "free-fall"],
      "scalars and vectors": [
        "scalar quantities",
        "vector quantities",
        "scalar and vector",
        "scalars and vectors",
      ],

      "horizontal and vertical components of projectile motion": [
        "horizontal component",
        "vertical component",
        "horizontal and vertical components",
        "horizontal velocity component",
        "vertical velocity component",
      ],

      "vector addition and subtraction": [
        "vector addition",
        "vector subtraction",
        "adding vectors",
        "subtracting vectors",
        "addition of vectors",
        "subtraction of vectors",
      ],

      "resolution of vectors into components": [
        "resolution of vectors",
        "resolving vectors",
        "resolve vectors",
        "vector components",
        "components of a vector",
      ],

      "vector representation": [
        "vector representation",
        "representation of a vector",
        "geometric representation of a vector",
        "directed line segment",
        "vector diagram",
        "magnitude and direction",
      ],

      "projectile from an elevated point": [
        "projectile from height",
        "projectile from an elevated point",
        "projectile launched from height",
        "projectile launched from an elevated point",
        "projectile from a height",
        "projectile with initial height",
        "projectile launched from a height",
        "projectile launched from a platform",
        "horizontal projection from height",
      ],
      pyq: ["pyq", "previous year question", "previous year questions"],
    };
    const aliases = topicAliases[topicLower] ?? [];

    const covered =
      searchableContent.includes(topicLower) ||
      aliases.some((alias) => searchableContent.includes(alias));

    if (!covered) {
      errors.push(`Required topic not adequately represented: ${topic}.`);
    }
  }

  // ------------------------------------------
  // 12. FORBIDDEN ACADEMIC TERMINOLOGY
  // ------------------------------------------

  for (const phrase of qualitySpec.forbiddenPhrases ?? []) {
    if (searchableContent.includes(phrase.toLowerCase())) {
      errors.push(`Forbidden/outdated terminology detected: "${phrase}".`);
    }
  }

  // ------------------------------------------
  // 13. GOLD STANDARD CONCEPT COUNT
  // ------------------------------------------

  if (concepts.length < qualitySpec.minimumConcepts) {
    errors.push(
      `Gold Standard requires at least ${qualitySpec.minimumConcepts} concepts. Found ${concepts.length}.`,
    );
  }
  return {
    valid: errors.length === 0,
    score,
    errors,
    warnings,
  };
}
