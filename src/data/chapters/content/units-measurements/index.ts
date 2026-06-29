import type { ChapterContentBundle } from "@/types/chapter";
import { getChapterMeta } from "../../registry";
import { unitsMeasurementsMindMap } from "./mindMap";
import { unitsMeasurementsConcepts } from "./concepts";
import { unitsMeasurementsFormulas } from "./formulas";
import { unitsMeasurementsExamples } from "./examples";
import { unitsMeasurementsQuizzes } from "./quizzes";

const meta = getChapterMeta(1)!;

export const unitsMeasurementsContent: ChapterContentBundle = {
  meta,
  mindMap: unitsMeasurementsMindMap,
  concepts: unitsMeasurementsConcepts,
  formulas: unitsMeasurementsFormulas,
  examples: unitsMeasurementsExamples,
  quizzes: unitsMeasurementsQuizzes,
};
