import type { ChapterContentBundle, ChapterMeta } from "@/types/chapter";
import { DEFAULT_QUIZZES } from "./constants";

export function createStubChapterContent(meta: ChapterMeta): ChapterContentBundle {
  return {
    meta,
    mindMap: {
      centerLabel: meta.title,
      centerSubtitle: `Class ${meta.classLevel} · Chapter ${meta.classOrder}`,
      nodes: [],
    },
    concepts: [],
    formulas: [],
    examples: [],
    quizzes: {
      ...DEFAULT_QUIZZES,
      concept: [],
      competition: [],
    },
  };
}
