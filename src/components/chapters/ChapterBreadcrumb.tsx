import Link from "next/link";
import type { ChapterMeta } from "@/types/chapter";

interface ChapterBreadcrumbProps {
  meta: ChapterMeta;
}

export default function ChapterBreadcrumb({ meta }: ChapterBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-semibold tracking-wide">
      <Link href="/dashboard" className="hover:text-white transition-colors">
        Physics
      </Link>
      <span>&rarr;</span>
      <span className="text-slate-400">Class {meta.classLevel}</span>
      <span>&rarr;</span>
      <span className="text-white font-bold">{meta.title}</span>
    </div>
  );
}
