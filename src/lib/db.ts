import { supabase } from "@/lib/supabaseClient";
import { getRegistryDbRecords, getChapterMeta } from "@/data/chapters/registry";
import type { ClassLevel, ChapterContentBundle } from "@/types/chapter";

import {
  CONCEPT_PASS_PERCENT,
  COMPETITION_PASS_PERCENT,
  COMPETITION_DURATION_SEC,
} from "@/data/chapters/constants";
export interface PhysicsChapter {
  chapterId: number;
  title: string;
  order: number;
  classLevel: ClassLevel;
  classOrder: number;
  slug: string;
}

export interface ChapterProgress {
  uid: string;
  chapterId: number;
  mindMapCompleted: boolean;
  conceptsCompleted: boolean;
  formulaSheetCompleted: boolean;
  examplesCompleted: boolean;
  conceptTestScore: number;
  competitionTestScore: number;
  chapterCompleted: boolean;
}

const DEFAULT_CHAPTERS: PhysicsChapter[] = getRegistryDbRecords();

function enrichChapterFromRegistry(chapter: PhysicsChapter): PhysicsChapter {
  const meta = getChapterMeta(chapter.chapterId);

  if (!meta) return chapter;

  return {
    chapterId: meta.globalId,
    title: meta.title,
    order: meta.globalId,
    classLevel: meta.classLevel,
    classOrder: meta.classOrder,
    slug: meta.slug,
  };
}

function mapDbChapter(row: any): PhysicsChapter {
  const chapterId =
    Number(row.class_level) === 11
      ? Number(row.chapter_number)
      : 15 + Number(row.chapter_number);

  return {
    chapterId,
    title: row.title,
    order: Number(row.sequence),
    classLevel: Number(row.class_level) as ClassLevel,
    classOrder: Number(row.chapter_number),
    slug: row.slug,
  };
}
function mapDbProgress(row: any): ChapterProgress {
  return {
    uid: row.profile_id,
    chapterId: Number(row.chapter_id),

    mindMapCompleted: Boolean(row.mind_map_completed),

    conceptsCompleted: Boolean(row.concepts_completed),

    formulaSheetCompleted: Boolean(row.formula_sheet_completed),

    examplesCompleted: Boolean(row.examples_completed),

    conceptTestScore: Number(row.concept_test_score),

    competitionTestScore: Number(row.competition_test_score),

    chapterCompleted: Boolean(row.chapter_completed),
  };
}
/**
 * Chapters are seeded through SQL migrations.
 * This function is intentionally left as a no-op.
 */
export async function seedChaptersIfEmpty(): Promise<void> {
  return;
}

/**
 * Returns all chapters sorted exactly as stored in Supabase.
 */
export async function getChapters(): Promise<PhysicsChapter[]> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .order("class_level", { ascending: true })
      .order("sequence", { ascending: true });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return DEFAULT_CHAPTERS;
    }

    return data.map(mapDbChapter).map(enrichChapterFromRegistry);
  } catch (err) {
    console.error("Error fetching chapters", JSON.stringify(err, null, 2));

    return DEFAULT_CHAPTERS;
  }
}
/**
 * Returns progress of a single chapter.
 */
/**
 * Saves generated AI content for a chapter.
 *
 * The chapter_content table uses the UUID of the chapters table,
 * while PhysicsRishi internally identifies chapters by globalId.
 */

export async function getChapterContentFromDb(
  chapterId: number,
): Promise<ChapterContentBundle | null> {
  try {
    const classLevel = chapterId <= 15 ? 11 : 12;
    const chapterNumber = classLevel === 11 ? chapterId : chapterId - 15;

    const { data: chapter, error: chapterError } = await supabase
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

    const { data, error } = await supabase
      .from("chapter_content")
      .select("*")
      .eq("chapter_id", chapter.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const meta = getChapterMeta(chapterId);

    if (!meta) {
      throw new Error(
        `Chapter metadata not found for global chapter ID ${chapterId}.`,
      );
    }

    return {
      meta,
      mindMap: data.mind_map,
      concepts: data.concept_cards,
      formulas: data.formula_sheet,
      examples: [...(data.neet_examples ?? []), ...(data.jee_examples ?? [])],
      quizzes: {
        concept: data.concept_questions ?? [],
        competition: data.competition_questions ?? [],
        conceptPassPercent: CONCEPT_PASS_PERCENT,
        competitionPassPercent: COMPETITION_PASS_PERCENT,
        competitionDurationSec: COMPETITION_DURATION_SEC,
      },
    };
  } catch (err) {
    console.error(
      "Failed to load chapter content from database",
      JSON.stringify(err, null, 2),
    );

    return null;
  }
}
export async function getChapterProgress(
  uid: string,
  chapterId: number,
): Promise<ChapterProgress> {
  const defaultProgress: ChapterProgress = {
    uid,
    chapterId,
    mindMapCompleted: false,
    conceptsCompleted: false,
    formulaSheetCompleted: false,
    examplesCompleted: false,
    conceptTestScore: 0,
    competitionTestScore: 0,
    chapterCompleted: false,
  };

  try {
    const { data, error } = await supabase
      .from("chapter_progress")
      .select("*")
      .eq("profile_id", uid)
      .eq("chapter_id", chapterId)
      .maybeSingle();

    if (error) throw error;

    return data ? mapDbProgress(data) : defaultProgress;
  } catch (err) {
    console.error(
      "Error loading chapter progress",
      JSON.stringify(err, null, 2),
    );

    return defaultProgress;
  }
}

/**
 * Returns progress of every chapter for dashboard.
 */
export async function getAllUserChapterProgress(
  uid: string,
): Promise<ChapterProgress[]> {
  try {
    const { data, error } = await supabase
      .from("chapter_progress")
      .select("*")
      .eq("profile_id", uid);

    if (error) throw error;

    return (data ?? []).map(mapDbProgress);
  } catch (err) {
    console.error(
      "Error fetching dashboard progress",
      JSON.stringify(err, null, 2),
    );

    return [];
  }
}
/**
 * Updates progress of a chapter and unlocks the next chapter.
 */
export async function updateChapterProgressFields(
  uid: string,
  chapterId: number,
  fields: Partial<ChapterProgress>,
  currentUserChapter?: number,
): Promise<ChapterProgress> {
  const current = await getChapterProgress(uid, chapterId);

  const updated: ChapterProgress = {
    ...current,
    ...fields,
    uid,
    chapterId,
  };

  updated.chapterCompleted =
    updated.mindMapCompleted &&
    updated.conceptsCompleted &&
    updated.formulaSheetCompleted &&
    updated.examplesCompleted &&
    updated.conceptTestScore >= 60 &&
    updated.competitionTestScore >= 70;

  const payload = {
    profile_id: uid,
    chapter_id: chapterId,
    mind_map_completed: updated.mindMapCompleted,
    concepts_completed: updated.conceptsCompleted,
    formula_sheet_completed: updated.formulaSheetCompleted,
    examples_completed: updated.examplesCompleted,
    concept_test_score: updated.conceptTestScore,
    competition_test_score: updated.competitionTestScore,
    chapter_completed: updated.chapterCompleted,
  };

  try {
    const { data: existing } = await supabase
      .from("chapter_progress")
      .select("id")
      .eq("profile_id", uid)
      .eq("chapter_id", chapterId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("chapter_progress")
        .update(payload)
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("chapter_progress").insert(payload);

      if (error) throw error;
    }

    if (updated.chapterCompleted && currentUserChapter === chapterId) {
      const { error } = await supabase
        .from("profiles")
        .update({
          current_chapter_number: chapterId + 1,
        })
        .eq("id", uid);

      if (error) {
        console.error(
          "Failed to unlock next chapter",
          JSON.stringify(error, null, 2),
        );
      }
    }

    return updated;
  } catch (err) {
    console.error(
      "Failed to update chapter progress",
      JSON.stringify(err, null, 2),
    );
    throw err;
  }
}
