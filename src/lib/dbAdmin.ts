import { supabaseAdmin } from "@/lib/supabaseAdmin";

import type { ChapterContentBundle } from "@/types/chapter";

export async function saveChapterContent(
  chapterId: number,
  content: ChapterContentBundle,
): Promise<void> {
  try {
    const classLevel = chapterId <= 15 ? 11 : 12;
    const chapterNumber = classLevel === 11 ? chapterId : chapterId - 15;

    const { data: chapter, error: chapterError } = await supabaseAdmin
      .from("chapters")
      .select("id")
      .eq("class_level", classLevel)
      .eq("chapter_number", chapterNumber)
      .maybeSingle();

    if (chapterError) {
      throw chapterError;
    }

    if (!chapter) {
      throw new Error(
        `Database chapter not found for global chapter ID ${chapterId}.`,
      );
    }

    const neetExamples = content.examples.filter(
      (example: any) => String(example.exam).toLowerCase() === "neet",
    );

    const jeeExamples = content.examples.filter((example: any) =>
      String(example.exam).toLowerCase().includes("jee"),
    );

    const { error } = await supabaseAdmin.from("chapter_content").upsert(
      {
        chapter_id: chapter.id,
        mind_map: content.mindMap,
        concept_cards: content.concepts,
        formula_sheet: content.formulas,
        neet_examples: neetExamples,
        jee_examples: jeeExamples,
        concept_questions: content.quizzes.concept,
        competition_questions: content.quizzes.competition,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "chapter_id",
      },
    );

    if (error) {
      throw error;
    }

    console.log(
      `Chapter content saved successfully for global chapter ${chapterId}.`,
    );
  } catch (err) {
    console.error(
      "Failed to save chapter content",
      JSON.stringify(err, null, 2),
    );

    throw err;
  }
}
