"use client";

import { useState } from "react";
import type { ChapterMeta, FormulaEntry } from "@/types/chapter";
import ContentPlaceholder from "../shared/ContentPlaceholder";

interface FormulasTabProps {
  meta: ChapterMeta;
  formulas: FormulaEntry[];
  learnedFormulaIds: string[];
  onToggleLearned: (id: string, nextLearnedIds: string[]) => void;
}

export default function FormulasTab({
  meta,
  formulas,
  learnedFormulaIds,
  onToggleLearned,
}: FormulasTabProps) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  if (formulas.length === 0) {
    return <ContentPlaceholder section="Formula Sheet" chapterTitle={meta.title} />;
  }

  const handleToggleLearned = (id: string) => {
    const isLearned = learnedFormulaIds.includes(id);
    const updated = isLearned
      ? learnedFormulaIds.filter((f) => f !== id)
      : [...learnedFormulaIds, id];
    onToggleLearned(id, updated);
  };

  const handleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h2 className="font-display font-extrabold text-2xl text-white mb-2">High-Yield Formula Sheet</h2>
        <p className="text-slate-400 text-sm">
          Master essential formulas. Mark each as learned and bookmark high-priority revisions.
        </p>
        <div className="mt-3 text-xs font-semibold text-neet">
          Formulas Memorized: {learnedFormulaIds.length} of {formulas.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formulas.map((form) => {
          const isLearned = learnedFormulaIds.includes(form.id);
          const isBookmarked = bookmarkedIds.includes(form.id);
          return (
            <div
              key={form.id}
              className={`p-6 rounded-3xl border glassmorphism transition-all flex flex-col justify-between ${
                isLearned ? "border-neet bg-emerald-500/5" : "border-dark-border/40"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-dark-border/20 pb-3">
                  <h4 className="font-bold text-white text-sm sm:text-base">{form.title}</h4>
                  <button
                    onClick={() => handleBookmark(form.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isBookmarked
                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                        : "border-dark-border/50 text-slate-500 hover:text-white"
                    }`}
                  >
                    ★
                  </button>
                </div>
                <pre className="font-mono text-xs sm:text-sm text-slate-350 leading-relaxed bg-black/35 p-4 rounded-xl border border-dark-border/30 overflow-x-auto whitespace-pre-wrap">
                  {form.code}
                </pre>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleToggleLearned(form.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider border transition-all ${
                    isLearned
                      ? "bg-neet/10 border-neet/30 text-neet"
                      : "border-dark-border/60 text-slate-400 hover:border-neet hover:text-white"
                  }`}
                >
                  {isLearned ? "✓ Learned" : "Mark as Learned"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
