import { NextResponse } from "next/server";
import { testContentEngine } from "@/lib/content-engine/testGenerator";

export async function GET() {
  try {
    const result = await testContentEngine();
    //For test after that remove this part and lines before codes
    return NextResponse.json({
      success: true,
      message: "PhysicsRishi Content Engine test passed.",
      result,
    });
    //return NextResponse.json({
    // success: true,
    // message: "PhysicsRishi Content Engine test passed.",
    // result: {
    // title: chapter.meta.title,
    //  slug: chapter.meta.slug,
    //  concepts: chapter.concepts.length,
    //  formulas: chapter.formulas.length,
    //   examples: chapter.examples.length,
    //   conceptQuestions: chapter.quizzes.concept.length,
    //    competitionQuestions: chapter.quizzes.competition.length,
    //   },
    // });
  } catch (error) {
    console.error("Content engine test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown content engine error.",
      },
      { status: 500 },
    );
  }
}
