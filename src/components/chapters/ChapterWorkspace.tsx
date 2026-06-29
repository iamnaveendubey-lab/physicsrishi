"use client";

import ChapterBreadcrumb from "./ChapterBreadcrumb";
import ChapterProgressBar from "./ChapterProgressBar";
import ChapterTabNav from "./ChapterTabNav";
import MindMapTab from "./tabs/MindMapTab";
import ConceptsTab from "./tabs/ConceptsTab";
import FormulasTab from "./tabs/FormulasTab";
import ExamplesTab from "./tabs/ExamplesTab";
import ConceptTestTab from "./tabs/ConceptTestTab";
import CompetitionTestTab from "./tabs/CompetitionTestTab";
import { useChapterWorkspace } from "@/hooks/useChapterWorkspace";

interface ChapterWorkspaceProps {
  chapterId: number;
}

export default function ChapterWorkspace({ chapterId }: ChapterWorkspaceProps) {
  const {
    content,
    progress,
    loading,
    activeTab,
    setActiveTab,
    exploredNodes,
    activeMindMapNode,
    readConceptIds,
    learnedFormulaIds,
    reviewedExampleIds,
    isNotesCompleted,
    isConceptTestPassed,
    handleExploreNode,
    handleReadConcept,
    handleToggleFormula,
    handleReviewExample,
    saveProgress,
  } = useChapterWorkspace(chapterId);

  if (loading || !content || !progress) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-physics-purple" />
      </div>
    );
  }

  const { meta } = content;

  return (
    <div className="relative overflow-hidden bg-dark-bg min-h-screen py-12">
      <div className="absolute inset-0 physics-grid opacity-15 pointer-events-none" />
      <div className="absolute top-[10%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-physics-purple/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-dark-border/20 pb-4">
          <ChapterBreadcrumb meta={meta} />
          <span
            className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full ${
              progress.chapterCompleted
                ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/25 animate-pulse"
                : "bg-white/5 border border-dark-border/40 text-slate-400"
            }`}
          >
            {progress.chapterCompleted ? "Chapter Mastered" : "Active Syllabus Track"}
          </span>
        </div>

        <ChapterProgressBar progress={progress} />
        <ChapterTabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "mindmap" && (
          <MindMapTab
            chapterTitle={meta.title}
            mindMap={content.mindMap}
            exploredNodes={exploredNodes}
            activeNodeId={activeMindMapNode}
            onExploreNode={handleExploreNode}
          />
        )}

        {activeTab === "concepts" && (
          <ConceptsTab
            meta={meta}
            concepts={content.concepts}
            readConceptIds={readConceptIds}
            onReadConcept={handleReadConcept}
          />
        )}

        {activeTab === "formulas" && (
          <FormulasTab
            meta={meta}
            formulas={content.formulas}
            learnedFormulaIds={learnedFormulaIds}
            onToggleLearned={handleToggleFormula}
          />
        )}

        {activeTab === "examples" && (
          <ExamplesTab
            meta={meta}
            examples={content.examples}
            reviewedExampleIds={reviewedExampleIds}
            onReviewExample={handleReviewExample}
          />
        )}

        {activeTab === "concepttest" && (
          <ConceptTestTab
            meta={meta}
            quizzes={content.quizzes}
            progress={progress}
            isNotesCompleted={isNotesCompleted}
            onSaveScore={(score) => saveProgress({ conceptTestScore: score })}
          />
        )}

        {activeTab === "comptest" && (
          <CompetitionTestTab
            meta={meta}
            quizzes={content.quizzes}
            progress={progress}
            isConceptTestPassed={isConceptTestPassed}
            onSaveScore={(score) => saveProgress({ competitionTestScore: score })}
          />
        )}
      </div>
    </div>
  );
}
