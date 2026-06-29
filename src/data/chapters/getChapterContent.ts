import type { ChapterContentBundle } from "@/types/chapter";
import { getChapterMeta } from "./registry";
import { createStubChapterContent } from "./_template";
import { unitsMeasurementsContent } from "./content/units-measurements";

const CONTENT_BY_SLUG: Record<string, ChapterContentBundle> = {
  "units-measurements": unitsMeasurementsContent,
};

export function getChapterContent(globalId: number): ChapterContentBundle {
  const meta = getChapterMeta(globalId);
  if (!meta) {
    throw new Error(`Chapter with globalId ${globalId} not found in registry.`);
  }

  const content = CONTENT_BY_SLUG[meta.slug];
  if (content) {
    return content;
  }

  return createStubChapterContent(meta);
}

export function hasChapterContent(globalId: number): boolean {
  const meta = getChapterMeta(globalId);
  return meta ? meta.contentStatus === "complete" : false;
}
