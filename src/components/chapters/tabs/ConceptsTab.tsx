"use client";

import { useState } from "react";
import type { ChapterMeta, ConceptCard } from "@/types/chapter";
import ContentPlaceholder from "../shared/ContentPlaceholder";

interface ConceptsTabProps {
  meta: ChapterMeta;
  concepts: ConceptCard[];
  readConceptIds: string[];
  onReadConcept: (id: string) => void;
}

export default function ConceptsTab({ meta, concepts, readConceptIds, onReadConcept }: ConceptsTabProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  if (concepts.length === 0) {
    return <ContentPlaceholder section="Concepts" chapterTitle={meta.title} />;
  }

  const handleOpen = (concept: ConceptCard, index: number) => {
    setActiveModalIndex(index);
    onReadConcept(concept.id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-left">
        <h2 className="font-display font-extrabold text-2xl text-white mb-2">Syllabus Concepts Deck</h2>
        <p className="text-slate-400 text-sm">
          Click cards to view comprehensive definitions and log your review status for {meta.title}.
        </p>
        <div className="mt-3 text-xs font-semibold text-physics-blue">
          Topics Studied: {readConceptIds.length} of {concepts.length}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {concepts.map((concept, idx) => {
          const isRead = readConceptIds.includes(concept.id);
          return (
            <button
              key={concept.id}
              onClick={() => handleOpen(concept, idx)}
              className={`text-left p-5 rounded-2xl glassmorphism glassmorphism-hover border transition-all ${
                isRead
                  ? "border-physics-blue bg-physics-blue/5 text-white"
                  : "border-dark-border/40 text-slate-400 hover:border-physics-blue/30"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-physics-blue">Concept {idx + 1}</span>
                {isRead && (
                  <span className="px-2 py-0.5 rounded bg-physics-blue/20 text-[9px] font-bold text-physics-blue-300">Reviewed</span>
                )}
              </div>
              <h4 className="font-bold text-white text-base mb-1">{concept.title}</h4>
              <p className="text-xs text-slate-500 leading-normal">{concept.overview}</p>
            </button>
          );
        })}
      </div>

      {activeModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl glassmorphism border border-physics-blue/30 bg-[#0d0720] shadow-2xl overflow-hidden p-6 sm:p-8 animate-float">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-physics-blue uppercase tracking-widest">
                Physics Concepts &bull; Class {meta.classLevel}
              </span>
              <button onClick={() => setActiveModalIndex(null)} className="text-slate-450 hover:text-white p-1">
                ✕ Close
              </button>
            </div>
            <h3 className="font-display font-black text-white text-xl sm:text-2xl mb-4">
              {concepts[activeModalIndex].title}
            </h3>
            <p className="text-slate-350 text-sm sm:text-base leading-relaxed mb-6">
              {concepts[activeModalIndex].body}
            </p>
            <button
              onClick={() => setActiveModalIndex(null)}
              className="w-full py-3 bg-physics-blue text-white font-bold rounded-xl text-sm transition-all"
            >
              Continue Study
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
