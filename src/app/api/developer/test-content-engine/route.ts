import { NextRequest, NextResponse } from "next/server";
import { testContentEngine } from "@/lib/content-engine/testGenerator";

export async function GET(request: NextRequest) {
  try {
    const chapterParam = request.nextUrl.searchParams.get("chapter");

    if (!chapterParam) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing chapter parameter. Use /api/developer/test-content-engine?chapter=1",
        },
        { status: 400 },
      );
    }

    const chapterId = Number(chapterParam);

    if (!Number.isInteger(chapterId) || chapterId < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid chapter parameter.",
        },
        { status: 400 },
      );
    }

    const result = await testContentEngine(chapterId);

    return NextResponse.json({
      success: true,
      message: "PhysicsRishi Content Engine test passed.",
      result,
    });
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
