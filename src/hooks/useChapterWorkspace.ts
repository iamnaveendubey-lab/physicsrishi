"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getChapterProgress,
  updateChapterProgressFields,
  ChapterProgress,
} from "@/lib/db";
import { getChapterContent } from "@/data/chapters";
import type { ChapterContentBundle, ChapterTabId } from "@/types/chapter";
import { CONCEPT_PASS_PERCENT, COMPETITION_PASS_PERCENT } from "@/data/chapters";

export function useChapterWorkspace(chapterId: number) {
  const { user, refreshUserProfile } = useAuth();

  const [content, setContent] = useState<ChapterContentBundle | null>(null);
  const [progress, setProgress] = useState<ChapterProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ChapterTabId>("mindmap");

  const [exploredNodes, setExploredNodes] = useState<string[]>([]);
  const [readConceptIds, setReadConceptIds] = useState<string[]>([]);
  const [learnedFormulaIds, setLearnedFormulaIds] = useState<string[]>([]);
  const [reviewedExampleIds, setReviewedExampleIds] = useState<number[]>([]);
  const [activeMindMapNode, setActiveMindMapNode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      try {
        const bundle = getChapterContent(chapterId);
        setContent(bundle);

        const prog = await getChapterProgress(user.uid, chapterId);
        setProgress(prog);

        if (prog.mindMapCompleted) {
          setExploredNodes(bundle.mindMap.nodes.map((n) => n.id));
        }
        if (prog.conceptsCompleted) {
          setReadConceptIds(bundle.concepts.map((c) => c.id));
        }
        if (prog.formulaSheetCompleted) {
          setLearnedFormulaIds(bundle.formulas.map((f) => f.id));
        }
        if (prog.examplesCompleted) {
          setReviewedExampleIds(bundle.examples.map((e) => e.id));
        }
      } catch (err) {
        console.error("Failed to load chapter workspace:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [chapterId, user]);

  const saveProgress = useCallback(
    async (fields: Partial<ChapterProgress>) => {
      if (!user) return;
      try {
        const updated = await updateChapterProgressFields(
          user.uid,
          chapterId,
          fields,
          user.currentChapter
        );
        setProgress(updated);
        await refreshUserProfile();
      } catch (err) {
        console.error("Database save failed:", err);
      }
    },
    [user, chapterId, refreshUserProfile]
  );

  const handleExploreNode = (id: string) => {
    if (!content) return;
    setActiveMindMapNode(id);
    if (!exploredNodes.includes(id)) {
      const updated = [...exploredNodes, id];
      setExploredNodes(updated);
      if (updated.length === content.mindMap.nodes.length && content.mindMap.nodes.length > 0) {
        saveProgress({ mindMapCompleted: true });
      }
    }
  };

  const handleReadConcept = (id: string) => {
    if (!content) return;
    if (!readConceptIds.includes(id)) {
      const updated = [...readConceptIds, id];
      setReadConceptIds(updated);
      if (updated.length === content.concepts.length && content.concepts.length > 0) {
        saveProgress({ conceptsCompleted: true });
      }
    }
  };

  const handleToggleFormula = (_id: string, nextIds: string[]) => {
    if (!content) return;
    setLearnedFormulaIds(nextIds);
    if (nextIds.length === content.formulas.length && content.formulas.length > 0) {
      saveProgress({ formulaSheetCompleted: true });
    }
  };

  const handleReviewExample = (id: number) => {
    if (!content) return;
    if (!reviewedExampleIds.includes(id)) {
      const updated = [...reviewedExampleIds, id];
      setReviewedExampleIds(updated);
      if (updated.length === content.examples.length && content.examples.length > 0) {
        saveProgress({ examplesCompleted: true });
      }
    }
  };

  const isNotesCompleted =
    !!progress &&
    progress.mindMapCompleted &&
    progress.conceptsCompleted &&
    progress.formulaSheetCompleted &&
    progress.examplesCompleted;

  const isConceptTestPassed = (progress?.conceptTestScore ?? 0) >= CONCEPT_PASS_PERCENT;
  const isCompetitionTestPassed = (progress?.competitionTestScore ?? 0) >= COMPETITION_PASS_PERCENT;

  return {
    user,
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
    isCompetitionTestPassed,
    handleExploreNode,
    handleReadConcept,
    handleToggleFormula,
    handleReviewExample,
    saveProgress,
  };
}
