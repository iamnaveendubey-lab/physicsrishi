import type {
  ChapterMeta,
  MindMapConfig,
  ConceptCard,
  FormulaEntry,
  SolvedExample,
  MCQ,
} from "@/types/chapter";

/**
 * Input given to the PhysicsRishi content generator.
 *
 * This describes WHAT chapter should be generated.
 * It does not contain the generated content itself.
 */
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

/**
 * Generated chapter content.
 *
 * This is intentionally close to the existing
 * ChapterContentBundle so that generated content
 * can eventually plug into the existing application.
 */
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
