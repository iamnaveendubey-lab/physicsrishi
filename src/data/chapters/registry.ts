import type { ChapterMeta, ClassLevel } from "@/types/chapter";

interface RegistryEntry {
  classLevel: ClassLevel;
  classOrder: number;
  title: string;
  slug: string;
  contentStatus: ChapterMeta["contentStatus"];
}

const CLASS_11: RegistryEntry[] = [
  { classLevel: 11, classOrder: 1, title: "Units and Measurements", slug: "units-measurements", contentStatus: "complete" },
  { classLevel: 11, classOrder: 2, title: "Motion in One Dimension", slug: "motion-1d", contentStatus: "stub" },
  { classLevel: 11, classOrder: 3, title: "Motion in Two Dimensions", slug: "motion-2d", contentStatus: "stub" },
  { classLevel: 11, classOrder: 4, title: "Laws of Motion", slug: "laws-of-motion", contentStatus: "stub" },
  { classLevel: 11, classOrder: 5, title: "Work Energy and Power", slug: "work-energy-power", contentStatus: "stub" },
  { classLevel: 11, classOrder: 6, title: "Center of Mass", slug: "center-of-mass", contentStatus: "stub" },
  { classLevel: 11, classOrder: 7, title: "Rotational Motion", slug: "rotational-motion", contentStatus: "stub" },
  { classLevel: 11, classOrder: 8, title: "Gravitation", slug: "gravitation", contentStatus: "stub" },
  { classLevel: 11, classOrder: 9, title: "Mechanical Properties of Solids", slug: "mechanical-properties-solids", contentStatus: "stub" },
  { classLevel: 11, classOrder: 10, title: "Mechanical Properties of Fluids", slug: "mechanical-properties-fluids", contentStatus: "stub" },
  { classLevel: 11, classOrder: 11, title: "Thermal Physics", slug: "thermal-physics", contentStatus: "stub" },
  { classLevel: 11, classOrder: 12, title: "Thermodynamics", slug: "thermodynamics", contentStatus: "stub" },
  { classLevel: 11, classOrder: 13, title: "Kinetic Theory of Gases", slug: "kinetic-theory-gases", contentStatus: "stub" },
  { classLevel: 11, classOrder: 14, title: "Oscillations", slug: "oscillations", contentStatus: "stub" },
  { classLevel: 11, classOrder: 15, title: "Waves", slug: "waves", contentStatus: "stub" },
];

const CLASS_12: RegistryEntry[] = [
  { classLevel: 12, classOrder: 1, title: "Electrostatics", slug: "electrostatics", contentStatus: "stub" },
  { classLevel: 12, classOrder: 2, title: "Capacitance", slug: "capacitance", contentStatus: "stub" },
  { classLevel: 12, classOrder: 3, title: "Current Electricity", slug: "current-electricity", contentStatus: "stub" },
  { classLevel: 12, classOrder: 4, title: "Moving Charges and Magnetism", slug: "moving-charges-magnetism", contentStatus: "stub" },
  { classLevel: 12, classOrder: 5, title: "Magnetism and Matter", slug: "magnetism-matter", contentStatus: "stub" },
  { classLevel: 12, classOrder: 6, title: "Electromagnetic Induction", slug: "electromagnetic-induction", contentStatus: "stub" },
  { classLevel: 12, classOrder: 7, title: "Alternating Current", slug: "alternating-current", contentStatus: "stub" },
  { classLevel: 12, classOrder: 8, title: "Electromagnetic Waves", slug: "electromagnetic-waves", contentStatus: "stub" },
  { classLevel: 12, classOrder: 9, title: "Ray Optics", slug: "ray-optics", contentStatus: "stub" },
  { classLevel: 12, classOrder: 10, title: "Wave Optics", slug: "wave-optics", contentStatus: "stub" },
  { classLevel: 12, classOrder: 11, title: "Dual Nature of Matter", slug: "dual-nature-matter", contentStatus: "stub" },
  { classLevel: 12, classOrder: 12, title: "Atoms", slug: "atoms", contentStatus: "stub" },
  { classLevel: 12, classOrder: 13, title: "Nuclei", slug: "nuclei", contentStatus: "stub" },
  { classLevel: 12, classOrder: 14, title: "Semiconductor Electronics", slug: "semiconductor-electronics", contentStatus: "stub" },
  { classLevel: 12, classOrder: 15, title: "Communication Systems", slug: "communication-systems", contentStatus: "stub" },
];

function buildRegistry(): ChapterMeta[] {
  const entries = [...CLASS_11, ...CLASS_12];
  return entries.map((entry, index) => ({
    globalId: index + 1,
    ...entry,
  }));
}

export const CHAPTER_REGISTRY: ChapterMeta[] = buildRegistry();

export function getChapterMeta(globalId: number): ChapterMeta | undefined {
  return CHAPTER_REGISTRY.find((ch) => ch.globalId === globalId);
}

export function getChapterMetaBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTER_REGISTRY.find((ch) => ch.slug === slug);
}

export function getAllChapters(): ChapterMeta[] {
  return CHAPTER_REGISTRY;
}

export function getChaptersByClass(classLevel: ClassLevel): ChapterMeta[] {
  return CHAPTER_REGISTRY.filter((ch) => ch.classLevel === classLevel);
}

export function toDbChapterRecord(meta: ChapterMeta) {
  return {
    chapterId: meta.globalId,
    title: meta.title,
    order: meta.globalId,
    classLevel: meta.classLevel,
    classOrder: meta.classOrder,
    slug: meta.slug,
  };
}

export function getRegistryDbRecords() {
  return CHAPTER_REGISTRY.map(toDbChapterRecord);
}
