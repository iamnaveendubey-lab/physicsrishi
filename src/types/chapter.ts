export type ClassLevel = 11 | 12;
export type ExamTrack = "jee" | "neet";
export type ContentStatus = "complete" | "stub";
export type ChapterTabId =
  | "mindmap"
  | "concepts"
  | "formulas"
  | "examples"
  | "concepttest"
  | "comptest";

export interface ChapterMeta {
  globalId: number;
  classLevel: ClassLevel;
  classOrder: number;
  title: string;
  slug: string;
  contentStatus: ContentStatus;
}

export interface MindMapNode {
  id: string;
  label: string;
  x: string;
  y: string;
  details: string;
}

export interface MindMapConfig {
  centerLabel: string;
  centerSubtitle: string;
  nodes: MindMapNode[];
}

export interface ConceptCard {
  id: string;
  title: string;
  overview: string;
  body: string;
}

export interface FormulaEntry {
  id: string;
  title: string;
  code: string;
}

export interface SolvedExample {
  id: number;
  exam: ExamTrack;
  question: string;
  options: string[];
  correct: string;
  solution: string;
}

export interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterQuizzes {
  concept: MCQ[];
  competition: MCQ[];
  conceptPassPercent: number;
  competitionPassPercent: number;
  competitionDurationSec: number;
}

export interface ChapterContentBundle {
  meta: ChapterMeta;
  mindMap: MindMapConfig;
  concepts: ConceptCard[];
  formulas: FormulaEntry[];
  examples: SolvedExample[];
  quizzes: ChapterQuizzes;
}

export interface ChapterTabDefinition {
  id: ChapterTabId;
  label: string;
}
