"use client";

import { useState } from "react";
import type { ChapterMeta, ExamTrack, SolvedExample } from "@/types/chapter";
import ContentPlaceholder from "../shared/ContentPlaceholder";

interface ExamplesTabProps {
  meta: ChapterMeta;
  examples: SolvedExample[];
  reviewedExampleIds: number[];
  onReviewExample: (id: number) => void;
}

export default function ExamplesTab({ meta, examples, reviewedExampleIds, onReviewExample }: ExamplesTabProps) {
  const [examTrack, setExamTrack] = useState<ExamTrack>("jee");
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  if (examples.length === 0) {
    return <ContentPlaceholder section="Solved Examples" chapterTitle={meta.title} />;
  }

  const neetCount = examples.filter((e) => e.exam === "neet").length;
  const jeeCount = examples.filter((e) => e.exam === "jee").length;

  const toggleSolution = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((x) => x !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
      onReviewExample(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white mb-2">Solved Example Index</h2>
          <p className="text-slate-400 text-sm">
            Review step-by-step solutions for NEET and JEE Main examples.
          </p>
          <div className="mt-3 text-xs font-semibold text-jee">
            Examples Reviewed: {reviewedExampleIds.length} of {examples.length}
          </div>
        </div>

        <div className="flex p-1 bg-white/5 border border-dark-border/40 rounded-xl">
          <button
            onClick={() => setExamTrack("jee")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              examTrack === "jee" ? "bg-jee text-white" : "text-slate-500 hover:text-white"
            }`}
          >
            JEE Main ({jeeCount})
          </button>
          <button
            onClick={() => setExamTrack("neet")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              examTrack === "neet" ? "bg-neet text-white" : "text-slate-500 hover:text-white"
            }`}
          >
            NEET Medical ({neetCount})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {examples
          .filter((ex) => ex.exam === examTrack)
          .map((ex) => {
            const isReviewed = reviewedExampleIds.includes(ex.id);
            const isExpanded = expandedIds.includes(ex.id);
            return (
              <div
                key={ex.id}
                className={`p-6 rounded-3xl border glassmorphism transition-all ${
                  isReviewed ? "border-jee/20" : "border-dark-border/40"
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className="text-xs font-bold text-jee uppercase tracking-widest">Example {ex.id}</span>
                  {isReviewed && (
                    <span className="px-3 py-1 rounded bg-jee/10 border border-jee/20 text-[10px] font-bold text-jee">Reviewed</span>
                  )}
                </div>
                <h4 className="font-bold text-white text-base leading-relaxed mb-4">{ex.question}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {ex.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-sm font-semibold select-none ${
                        opt === ex.correct
                          ? "bg-emerald-500/5 border-emerald-500/25 text-emerald-450 font-bold"
                          : "bg-black/15 border-dark-border/20 text-slate-500"
                      }`}
                    >
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toggleSolution(ex.id)}
                  className="px-5 py-2.5 bg-white/5 border border-dark-border/40 text-xs font-bold rounded-xl text-slate-350 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span>{isExpanded ? "Hide Steps" : "Show Step-by-Step Solution"}</span>
                  <span>{isExpanded ? "▲" : "▼"}</span>
                </button>

                {isExpanded && (
                  <div className="mt-4 p-5 bg-black/45 border border-dark-border/30 rounded-2xl text-sm leading-relaxed text-slate-350 animate-fade-in font-sans">
                    <span className="text-[10px] font-bold text-jee uppercase tracking-widest block mb-2">Step-by-Step Explanation</span>
                    {ex.solution}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
