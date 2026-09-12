import { generateChapter } from "./generateChapter";
import { unitsMeasurementsSpec } from "./chapterSpecs";
import { GeminiProvider } from "./geminiProvider";
import { saveChapterContent } from "@/lib/dbAdmin";
export async function testContentEngine() {
  const provider = new GeminiProvider();

  const chapter = await generateChapter(unitsMeasurementsSpec, provider);
  await saveChapterContent(unitsMeasurementsSpec.globalId, chapter);
  console.log("PhysicsRishi Gemini Generation PASSED");

  console.log({
    chapter: chapter.meta.title,
    slug: chapter.meta.slug,
    concepts: chapter.concepts.length,
    formulas: chapter.formulas.length,
    examples: chapter.examples.length,
    conceptQuestions: chapter.quizzes.concept.length,
    competitionQuestions: chapter.quizzes.competition.length,
  });

  return chapter;
}
