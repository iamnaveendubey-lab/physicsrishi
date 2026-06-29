import type { ChapterProgress } from "@/lib/db";
import { CONCEPT_PASS_PERCENT, COMPETITION_PASS_PERCENT } from "@/data/chapters";

interface ChapterProgressBarProps {
  progress: ChapterProgress;
}

export default function ChapterProgressBar({ progress }: ChapterProgressBarProps) {
  const isConceptTestPassed = progress.conceptTestScore >= CONCEPT_PASS_PERCENT;
  const isCompetitionTestPassed = progress.competitionTestScore >= COMPETITION_PASS_PERCENT;

  const items = [
    { label: "Mind Map", active: progress.mindMapCompleted, color: "border-physics-purple text-physics-purple" },
    { label: "Concepts", active: progress.conceptsCompleted, color: "border-physics-blue text-physics-blue" },
    { label: "Formulae", active: progress.formulaSheetCompleted, color: "border-neet text-neet" },
    { label: "Examples", active: progress.examplesCompleted, color: "border-jee text-jee" },
    { label: `Concept Test: ${progress.conceptTestScore}%`, active: isConceptTestPassed, color: "border-physics-purple text-physics-purple-300" },
    { label: `Comp Test: ${progress.competitionTestScore}%`, active: isCompetitionTestPassed, color: "border-physics-blue text-physics-blue-300" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
            item.active
              ? `bg-white/5 border-l-4 ${item.color}`
              : "bg-dark-bg/40 border-dark-border/30 text-slate-600 opacity-60"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            {item.active ? (
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" />
            )}
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
