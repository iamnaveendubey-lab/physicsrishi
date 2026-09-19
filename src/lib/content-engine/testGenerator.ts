import { generateChapter } from "./generateChapter";
import {
  unitsMeasurementsSpec,
  motion1DSpec,
  motion2DSpec,
  lawsOfMotionSpec,
} from "./chapterSpecs";
import { GeminiProvider } from "./geminiProvider";
import { saveChapterContent } from "@/lib/dbAdmin";
import type { ChapterGenerationRequest } from "./schema";

const CHAPTER_SPECS: Record<number, ChapterGenerationRequest> = {
  1: unitsMeasurementsSpec,
  2: motion1DSpec,
  3: motion2DSpec,
  4: lawsOfMotionSpec,
};

export async function testContentEngine(chapterId: number) {
  const spec = CHAPTER_SPECS[chapterId];

  if (!spec) {
    throw new Error(
      `No generation spec found for chapter ${chapterId}. Generation stopped.`,
    );
  }

  if (spec.globalId !== chapterId) {
    throw new Error(
      `Chapter safety check failed: requested ${chapterId}, spec is ${spec.globalId}. Generation stopped.`,
    );
  }

  console.log(
    `Starting Gemini generation for Chapter ${chapterId}: ${spec.title}`,
  );

  const provider = new GeminiProvider();

  const chapter = await generateChapter(spec, provider);

  if (chapter.meta.globalId !== chapterId) {
    throw new Error(
      `Generated chapter mismatch: requested ${chapterId}, generated ${chapter.meta.globalId}. Content was NOT saved.`,
    );
  }

  await saveChapterContent(chapterId, chapter);

  console.log("PhysicsRishi Gemini Generation PASSED");

  console.log({
    chapter: chapter.meta.title,
    slug: chapter.meta.slug,
    globalId: chapter.meta.globalId,
    concepts: chapter.concepts.length,
    formulas: chapter.formulas.length,
    examples: chapter.examples.length,
    conceptQuestions: chapter.quizzes.concept.length,
    competitionQuestions: chapter.quizzes.competition.length,
  });

  return chapter;
}
