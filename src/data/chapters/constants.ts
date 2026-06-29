import type { ChapterTabDefinition, ChapterQuizzes } from "@/types/chapter";

export const CONCEPT_PASS_PERCENT = 60;
export const COMPETITION_PASS_PERCENT = 70;
export const COMPETITION_DURATION_SEC = 3000;

export const DEFAULT_QUIZZES: Omit<ChapterQuizzes, "concept" | "competition"> = {
  conceptPassPercent: CONCEPT_PASS_PERCENT,
  competitionPassPercent: COMPETITION_PASS_PERCENT,
  competitionDurationSec: COMPETITION_DURATION_SEC,
};

export const CHAPTER_TABS: ChapterTabDefinition[] = [
  { id: "mindmap", label: "1. Mind Map" },
  { id: "concepts", label: "2. Concepts" },
  { id: "formulas", label: "3. Formulas" },
  { id: "examples", label: "4. Examples" },
  { id: "concepttest", label: "5. Concept Test" },
  { id: "comptest", label: "6. Competition Test" },
];
