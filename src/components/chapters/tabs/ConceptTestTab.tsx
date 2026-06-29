"use client";

import { useState } from "react";
import type { ChapterMeta, ChapterQuizzes } from "@/types/chapter";
import type { ChapterProgress } from "@/lib/db";
import LockedSection from "../shared/LockedSection";
import ContentPlaceholder from "../shared/ContentPlaceholder";

interface ConceptTestTabProps {
  meta: ChapterMeta;
  quizzes: ChapterQuizzes;
  progress: ChapterProgress;
  isNotesCompleted: boolean;
  onSaveScore: (score: number) => void;
}

export default function ConceptTestTab({
  meta,
  quizzes,
  progress,
  isNotesCompleted,
  onSaveScore,
}: ConceptTestTabProps) {
  const [testActive, setTestActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [testFinished, setTestFinished] = useState(false);

  const questions = quizzes.concept;
  const passPercent = quizzes.conceptPassPercent;
  const isPassed = progress.conceptTestScore >= passPercent;

  if (questions.length === 0) {
    return <ContentPlaceholder section="Concept Test" chapterTitle={meta.title} />;
  }

  const startTest = () => {
    setTestActive(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setAnswers([]);
    setTestFinished(false);
  };

  const submitOption = () => {
    if (selectedOption === null) return;
    const q = questions[currentIndex];
    setAnswers([...answers, selectedOption === q.correctIndex]);
    setShowFeedback(true);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      const correctCount = answers.filter(Boolean).length;
      const score = Math.round((correctCount / questions.length) * 100);
      onSaveScore(score);
      setTestFinished(true);
    }
  };

  const finalScore = Math.round((answers.filter(Boolean).length / questions.length) * 100);

  return (
    <div className="space-y-8">
      <div className="text-left max-w-3xl mb-8">
        <h2 className="font-display font-extrabold text-2xl text-white mb-2">Concept Test Assessment</h2>
        <p className="text-slate-400 text-sm">
          Answer {questions.length} conceptual MCQs. Score at least {passPercent}% to pass and unlock the Competition Test.
        </p>
        {progress.conceptTestScore > 0 && (
          <div className="mt-3">
            <span className={`text-xs font-bold ${isPassed ? "text-emerald-450" : "text-red-400"}`}>
              Highest Score: {progress.conceptTestScore}% ({isPassed ? "Passed" : "Failed"})
            </span>
          </div>
        )}
      </div>

      {!isNotesCompleted ? (
        <LockedSection
          title="Concept Test is Locked"
          message="Complete Mind Map, Concepts, Formulas, and Solved Examples to unlock the Concept Test."
        />
      ) : !testActive ? (
        <div className="p-8 rounded-3xl glassmorphism border border-dark-border text-center flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="font-display font-extrabold text-white text-xl mb-4">Start {questions.length} Qs Concept Test</h3>
          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            Solve physics MCQs one-by-one with instant feedback and explanations.
          </p>
          <button
            onClick={startTest}
            className="px-8 py-3.5 bg-gradient-to-r from-physics-purple to-physics-blue text-white font-bold rounded-xl text-sm transition-all"
          >
            Start Assessment
          </button>
        </div>
      ) : testFinished ? (
        <div className="p-8 rounded-3xl glassmorphism border border-dark-border text-center flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="font-display font-black text-white text-2xl mb-2">Test Finished!</h3>
          <p className="text-slate-400 text-sm mb-6">
            You scored <span className="text-white font-bold">{answers.filter(Boolean).length} / {questions.length}</span> ({finalScore}%)
          </p>
          {finalScore >= passPercent ? (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-sm font-semibold max-w-md">
              ★ PASSED! Concept Test cleared. Competition Test is now unlocked.
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold max-w-md">
              ✕ FAILED. Score at least {passPercent}% to unlock the Competition Test.
            </div>
          )}
          <div className="flex gap-4">
            <button onClick={startTest} className="px-6 py-3 bg-physics-purple hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all">
              Retake Test
            </button>
            <button
              onClick={() => { setTestActive(false); setTestFinished(false); }}
              className="px-6 py-3 bg-white/5 border border-dark-border text-white text-xs font-bold rounded-xl transition-all"
            >
              Exit Workspace
            </button>
          </div>
        </div>
      ) : (
        <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-dark-border">
          <div className="flex justify-between items-center mb-6 border-b border-dark-border/20 pb-3">
            <span className="text-xs font-bold text-physics-purple uppercase tracking-widest">
              Active Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-slate-400 font-bold">Score: {answers.filter(Boolean).length}</span>
          </div>

          <p className="text-white font-bold text-base sm:text-lg mb-6 leading-relaxed">{questions[currentIndex].question}</p>

          <div className="space-y-3 mb-6">
            {questions[currentIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => !showFeedback && setSelectedOption(idx)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                  selectedOption === idx
                    ? "bg-physics-purple/15 border-physics-purple text-white"
                    : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white"
                } ${showFeedback ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div
              className={`p-5 rounded-2xl border mb-6 text-sm leading-relaxed ${
                selectedOption === questions[currentIndex].correctIndex
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-450"
                  : "bg-red-500/10 border-red-500/30 text-red-405"
              }`}
            >
              <h4 className="font-bold mb-2">
                {selectedOption === questions[currentIndex].correctIndex
                  ? "✓ Correct Answer"
                  : `✕ Incorrect. Correct answer is option ${questions[currentIndex].correctIndex + 1}`}
              </h4>
              {questions[currentIndex].explanation}
            </div>
          )}

          <div className="flex gap-4">
            {!showFeedback ? (
              <button
                onClick={submitOption}
                disabled={selectedOption === null}
                className="px-6 py-3.5 bg-physics-purple disabled:opacity-50 text-white font-bold text-xs tracking-wider rounded-xl transition-all"
              >
                Verify Answer
              </button>
            ) : (
              <button
                onClick={goNext}
                className="px-6 py-3.5 bg-physics-purple text-white font-bold text-xs tracking-wider rounded-xl transition-all"
              >
                {currentIndex < questions.length - 1 ? "Next Question →" : "Finish Test"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
