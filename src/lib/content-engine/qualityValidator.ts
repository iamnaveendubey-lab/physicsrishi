import { UNITS_MEASUREMENTS_QUALITY_SPEC } from "./chapterQualitySpecs";
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

  if (examples.length < UNITS_MEASUREMENTS_QUALITY_SPEC.minimumExamples) {
    errors.push(
      `Only ${examples.length} solved examples generated. Minimum required is 5.`,
    );
  }

  if (examples.length > UNITS_MEASUREMENTS_QUALITY_SPEC.maximumExamples) {
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

  for (const topic of UNITS_MEASUREMENTS_QUALITY_SPEC.requiredTopics) {
    if (!searchableContent.includes(topic.toLowerCase())) {
      errors.push(`Required topic not adequately represented: ${topic}.`);
    }
  }

  // ------------------------------------------
  // 12. FORBIDDEN ACADEMIC TERMINOLOGY
  // ------------------------------------------

  for (const phrase of UNITS_MEASUREMENTS_QUALITY_SPEC.forbiddenPhrases ?? []) {
    if (searchableContent.includes(phrase.toLowerCase())) {
      errors.push(`Forbidden/outdated terminology detected: "${phrase}".`);
    }
  }

  // ------------------------------------------
  // 13. GOLD STANDARD CONCEPT COUNT
  // ------------------------------------------

  if (concepts.length < UNITS_MEASUREMENTS_QUALITY_SPEC.minimumConcepts) {
    errors.push(
      `Gold Standard requires at least ${UNITS_MEASUREMENTS_QUALITY_SPEC.minimumConcepts} concepts. Found ${concepts.length}.`,
    );
  }
  return {
    valid: errors.length === 0,
    score,
    errors,
    warnings,
  };
}
