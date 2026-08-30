/**
 * Unlock the next chapter for the current user
 */
export async function unlockNextChapter(uid: string, currentChapter: number) {
  const { supabase } = await import("@/lib/supabaseClient");
  const nextChapter = Math.min(currentChapter + 1, 29);

  const { data, error } = await supabase
    .from("profiles")
    .update({
      current_chapter_number: nextChapter,
    })
    .eq("id", uid)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Unlock all chapters
 */
export async function unlockAllChapters(uid: string) {
  const { supabase } = await import("@/lib/supabaseClient");
  const { data, error } = await supabase
    .from("profiles")
    .update({
      current_chapter_number: 29,
    })
    .eq("id", uid)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Reset complete learning progress
 */
export async function resetProgress(uid: string) {
  const { supabase } = await import("@/lib/supabaseClient");
  const { error: progressError } = await supabase
    .from("chapter_progress")
    .delete()
    .eq("profile_id", uid);

  if (progressError) throw progressError;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      current_chapter_number: 1,
    })
    .eq("id", uid)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Jump directly to any chapter
 */
export async function jumpToChapter(uid: string, chapter: number) {
  const { supabase } = await import("@/lib/supabaseClient");

  if (chapter < 1 || chapter > 29) {
    throw new Error("Invalid chapter number.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      current_chapter_number: chapter,
    })
    .eq("id", uid)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Mark current chapter as fully completed
 */
export async function completeCurrentChapter(uid: string, chapterId: number) {
  const { supabase } = await import("@/lib/supabaseClient");
  const payload = {
    profile_id: uid,
    chapter_id: chapterId,
    mind_map_completed: true,
    concepts_completed: true,
    formula_sheet_completed: true,
    examples_completed: true,
    concept_test_score: 100,
    competition_test_score: 100,
    chapter_completed: true,
  };

  const { error } = await supabase.from("chapter_progress").upsert(payload, {
    onConflict: "profile_id,chapter_id",
  });

  if (error) throw error;

  await unlockNextChapter(uid, chapterId);

  return true;
}

/**
 * Returns all progress rows for debugging
 */
export async function getDeveloperProgress(uid: string) {
  const { supabase } = await import("@/lib/supabaseClient");
  const { data, error } = await supabase
    .from("chapter_progress")
    .select("*")
    .eq("profile_id", uid)
    .order("chapter_id");

  if (error) throw error;

  return data;
}

/**
 * Returns complete profile information
 */
export async function getDeveloperProfile(uid: string) {
  const { supabase } = await import("@/lib/supabaseClient");
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uid)
    .single();

  if (error) throw error;

  return data;
}
