import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // Find Chapter 1 in the real database.
    const { data: chapter, error: chapterError } = await supabaseAdmin
      .from("chapters")
      .select("id, class_level, chapter_number, title")
      .eq("class_level", 11)
      .eq("chapter_number", 1)
      .maybeSingle();

    if (chapterError) {
      throw chapterError;
    }

    if (!chapter) {
      throw new Error("Chapter 1 was not found in the database.");
    }

    // Write a tiny test payload.
    const testPayload = {
      chapter_id: chapter.id,
      mind_map: {
        test: true,
        message: "PhysicsRishi persistence test",
      },
      concept_cards: [],
      formula_sheet: [],
      neet_examples: [],
      jee_examples: [],
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabaseAdmin
      .from("chapter_content")
      .upsert(testPayload, {
        onConflict: "chapter_id",
      });

    if (upsertError) {
      throw upsertError;
    }

    // Read it back immediately.
    const { data: saved, error: readError } = await supabaseAdmin
      .from("chapter_content")
      .select("*")
      .eq("chapter_id", chapter.id)
      .maybeSingle();

    if (readError) {
      throw readError;
    }

    if (!saved) {
      throw new Error(
        "Write succeeded but the saved row could not be read back.",
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase chapter_content persistence is working.",
      chapter,
      saved,
    });
  } catch (error) {
    console.error("Persistence test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    );
  }
}
