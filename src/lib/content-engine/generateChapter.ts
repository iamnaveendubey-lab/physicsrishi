import type { ChapterContentBundle } from "@/types/chapter";
import type { ChapterGenerationRequest, GeneratedChapter } from "./schema";
import { buildChapterGenerationPrompt } from "./prompts";
import { validateGeneratedChapter } from "./schema";
import type { AIProvider } from "./aiProvider";
import { validateChapterQuality } from "./qualityValidator";
/**
 * Generate one PhysicsRishi chapter.
 *
 * This function is intentionally independent of any specific
 * AI provider. OpenAI, Gemini, or another provider can be
 * injected later.
 */
export async function generateChapter(
  request: ChapterGenerationRequest,
  provider: AIProvider,
): Promise<ChapterContentBundle> {
  const prompt = buildChapterGenerationPrompt(request);

  const rawResponse = await provider.generateText(prompt);

  let parsed: GeneratedChapter;

  try {
    parsed = JSON.parse(rawResponse) as GeneratedChapter;
  } catch {
    throw new Error("AI returned invalid JSON. Chapter generation stopped.");
  }

  const validation = validateGeneratedChapter(parsed);

  if (!validation.valid) {
    throw new Error(
      `Generated chapter failed validation:\n${validation.errors.join("\n")}`,
    );
  }
  const qualityValidation = validateChapterQuality(
    parsed as ChapterContentBundle,
  );

  if (!qualityValidation.valid) {
    throw new Error(
      `Generated chapter failed quality validation:\n${qualityValidation.errors.join("\n")}`,
    );
  }
  return parsed as ChapterContentBundle;
}
