import type {
  ChapterContentBundle,
  ChapterMeta,
  MindMapConfig,
  ConceptCard,
  FormulaEntry,
  SolvedExample,
  MCQ,
} from "@/types/chapter";

export interface ChapterGenerationRequest {
  globalId: number;
  classLevel: 11 | 12;
  classOrder: number;
  title: string;
  slug: string;

  examTracks: ("jee" | "neet")[];

  difficulty: "easy" | "moderate" | "hard";

  expectedQuestions: {
    neet: number;
    jeeMain: number;
    jeeAdvanced?: number;
  };

  learningObjectives: string[];

  importantTopics: string[];

  prerequisites?: string[];

  specialInstructions?: string[];
}

export interface GeneratedChapter {
  meta: ChapterMeta;

  mindMap: MindMapConfig;

  concepts: ConceptCard[];

  formulas: FormulaEntry[];

  examples: SolvedExample[];

  quizzes: {
    concept: MCQ[];
    competition: MCQ[];
  };
}

/**
 * Runtime structural validation.
 *
 * This does not judge Physics quality.
 * It only verifies that the generated chapter
 * has the structure required by PhysicsRishi.
 */
export function validateGeneratedChapter(chapter: GeneratedChapter): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!chapter) {
    return {
      valid: false,
      errors: ["Generated chapter is empty."],
    };
  }

  // -----------------------------
  // META
  // -----------------------------

  if (!chapter.meta) {
    errors.push("Missing chapter metadata.");
  } else {
    if (!chapter.meta.title) {
      errors.push("Chapter title is missing.");
    }

    if (!chapter.meta.slug) {
      errors.push("Chapter slug is missing.");
    }
  }

  // -----------------------------
  // MIND MAP
  // -----------------------------

  if (!chapter.mindMap) {
    errors.push("Missing mind map.");
  } else if (!Array.isArray(chapter.mindMap.nodes)) {
    errors.push("Mind map nodes must be an array.");
  }

  // -----------------------------
  // CONCEPTS
  // -----------------------------

  if (!Array.isArray(chapter.concepts)) {
    errors.push("Concepts must be an array.");
  } else if (chapter.concepts.length === 0) {
    errors.push("Chapter must contain at least one concept.");
  }

  // -----------------------------
  // FORMULAS
  // -----------------------------

  if (!Array.isArray(chapter.formulas)) {
    errors.push("Formulas must be an array.");
  }

  // -----------------------------
  // EXAMPLES
  // -----------------------------

  if (!Array.isArray(chapter.examples)) {
    errors.push("Examples must be an array.");
  } else {
    if (chapter.examples.length < 5) {
      errors.push(
        `Chapter requires at least 5 examples. Found ${chapter.examples.length}.`,
      );
    }

    if (chapter.examples.length > 10) {
      errors.push(
        `Chapter should contain no more than 10 examples. Found ${chapter.examples.length}.`,
      );
    }
  }

  // -----------------------------
  // QUIZZES
  // -----------------------------

  if (!chapter.quizzes) {
    errors.push("Missing quiz configuration.");
  } else {
    if (!Array.isArray(chapter.quizzes.concept)) {
      errors.push("Concept quiz must be an array.");
    } else if (chapter.quizzes.concept.length !== 15) {
      errors.push(
        `Concept quiz must contain exactly 15 questions. Found ${chapter.quizzes.concept.length}.`,
      );
    }

    if (!Array.isArray(chapter.quizzes.competition)) {
      errors.push("Competition test must be an array.");
    } else if (chapter.quizzes.competition.length !== 50) {
      errors.push(
        `Competition test must contain exactly 50 questions. Found ${chapter.quizzes.competition.length}.`,
      );
    }
  }

  // -----------------------------
  // QUESTION VALIDATION
  // -----------------------------

  const allQuestions = [
    ...(chapter.quizzes?.concept ?? []),
    ...(chapter.quizzes?.competition ?? []),
  ];

  allQuestions.forEach((question, index) => {
    if (!question.question?.trim()) {
      errors.push(`Question ${index + 1} has no question text.`);
    }

    if (!Array.isArray(question.options)) {
      errors.push(`Question ${index + 1} has invalid options.`);
    } else if (question.options.length !== 4) {
      errors.push(`Question ${index + 1} must have exactly 4 options.`);
    }

    if (
      typeof question.correctIndex !== "number" ||
      question.correctIndex < 0 ||
      question.correctIndex > 3
    ) {
      errors.push(`Question ${index + 1} has an invalid correctIndex.`);
    }

    if (!question.explanation?.trim()) {
      errors.push(`Question ${index + 1} is missing an explanation.`);
    }
  });

  // -----------------------------
  // DUPLICATE QUESTION CHECK
  // -----------------------------

  const questionTexts = allQuestions.map((question) =>
    question.question.trim().toLowerCase(),
  );

  const duplicates = questionTexts.filter(
    (question, index) => questionTexts.indexOf(question) !== index,
  );

  if (duplicates.length > 0) {
    errors.push(`Duplicate questions detected: ${duplicates.length}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
