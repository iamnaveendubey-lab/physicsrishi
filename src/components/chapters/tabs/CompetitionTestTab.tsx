"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ChapterMeta, ChapterQuizzes } from "@/types/chapter";
import type { ChapterProgress } from "@/lib/db";
import LockedSection from "../shared/LockedSection";
import ContentPlaceholder from "../shared/ContentPlaceholder";

interface CompetitionTestTabProps {
  meta: ChapterMeta;
  quizzes: ChapterQuizzes;
  progress: ChapterProgress;
  isConceptTestPassed: boolean;
  onSaveScore: (score: number) => void;
}

function formatTime(sec: number) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function CompetitionTestTab({
  meta,
  quizzes,
  progress,
  isConceptTestPassed,
  onSaveScore,
}: CompetitionTestTabProps) {
  const questions = quizzes.competition;
  const passPercent = quizzes.competitionPassPercent;
  const durationSec = quizzes.competitionDurationSec;

  const [testActive, setTestActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [testFinished, setTestFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const completeTest = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSubmitting(true);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (responses[idx] === q.correctIndex) correctCount++;
    });

    const score = Math.round((correctCount / questions.length) * 100);
    await onSaveScore(score);
    setTestFinished(true);
    setSubmitting(false);
  }, [questions, responses, onSaveScore]);

  useEffect(() => {
    if (testActive && timeLeft > 0 && !testFinished) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (testActive && timeLeft === 0 && !testFinished) {
      completeTest();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [testActive, timeLeft, testFinished, completeTest]);

  if (questions.length === 0) {
    return <ContentPlaceholder section="Competition Test" chapterTitle={meta.title} />;
  }

  const isPassed = progress.competitionTestScore >= passPercent;
  const correctOnFinish = questions.filter((q, idx) => responses[idx] === q.correctIndex).length;

  const startTest = () => {
    setTestActive(true);
    setCurrentIndex(0);
    setResponses({});
    setFlagged([]);
    setTimeLeft(durationSec);
    setTestFinished(false);
  };

  const toggleFlag = (idx: number) => {
    setFlagged((prev) => (prev.includes(idx) ? prev.filter((f) => f !== idx) : [...prev, idx]));
  };

  return (
    <div className="space-y-8">
      <div className="text-left max-w-3xl mb-8">
        <h2 className="font-display font-extrabold text-2xl text-white mb-2">JEE/NEET Competition Test</h2>
        <p className="text-slate-400 text-sm">
          Answer {questions.length} MCQs under a {Math.floor(durationSec / 60)}-minute timer. Score at least {passPercent}% to pass.
        </p>
        {progress.competitionTestScore > 0 && (
          <div className="mt-3">
            <span className={`text-xs font-bold ${isPassed ? "text-emerald-450" : "text-red-400"}`}>
              Highest Score: {progress.competitionTestScore}% ({isPassed ? "Passed" : "Failed"})
            </span>
          </div>
        )}
      </div>

      {!isConceptTestPassed ? (
        <LockedSection
          title="Competition Test is Locked"
          message={`Pass the Concept Test with at least ${quizzes.conceptPassPercent}% to unlock the Competition Test.`}
        />
      ) : !testActive ? (
        <div className="p-8 rounded-3xl glassmorphism border border-dark-border text-center flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="font-display font-extrabold text-white text-xl mb-4">Start {questions.length} Qs Competition Test</h3>
          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            Time limit: {Math.floor(durationSec / 60)} minutes. Submit at the end to check accuracy.
          </p>
          <button
            onClick={startTest}
            className="px-8 py-3.5 bg-gradient-to-r from-physics-purple to-physics-blue text-white font-bold rounded-xl text-sm transition-all"
          >
            Enter Exam Mode
          </button>
        </div>
      ) : testFinished ? (
        <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-dark-border">
          <h3 className="font-display font-black text-white text-2xl text-center mb-6">Exam Analytics Report</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-5 rounded-2xl bg-white/5 border border-dark-border/40">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Accuracy Score</span>
              <p className="text-2xl font-black text-white mt-1">{progress.competitionTestScore}%</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-dark-border/40">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Correct Answers</span>
              <p className="text-2xl font-black text-emerald-450 mt-1">{correctOnFinish} / {questions.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-dark-border/40">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Time Taken</span>
              <p className="text-2xl font-black text-physics-blue mt-1">{formatTime(durationSec - timeLeft)}</p>
            </div>
          </div>
          <div className="flex justify-center mb-8">
            {progress.competitionTestScore >= passPercent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-sm font-semibold text-center">
                ★ CONGRATULATIONS! You passed the Competition Test and unlocked the next chapter.
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold text-center">
                ✕ FAILED. Retake the test to satisfy the unlocking criteria.
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-center">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 glassmorphism rounded-3xl p-6 border border-dark-border flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-dark-border/20 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    flagged.includes(currentIndex)
                      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                      : "border-dark-border/60 text-slate-500 hover:text-white"
                  }`}
                >
                  ⚑ Mark Review
                </button>
              </div>
              <p className="text-white font-bold text-sm sm:text-base mb-6 leading-relaxed">{questions[currentIndex].question}</p>
              <div className="space-y-3 mb-6">
                {questions[currentIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setResponses({ ...responses, [currentIndex]: idx })}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                      responses[currentIndex] === idx
                        ? "bg-physics-blue/15 border-physics-blue text-white"
                        : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="px-5 py-2.5 bg-white/5 border border-dark-border text-white text-xs font-bold rounded-lg disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
                className="px-5 py-2.5 bg-white/5 border border-dark-border text-white text-xs font-bold rounded-lg disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="glassmorphism rounded-3xl p-5 border border-dark-border space-y-6">
            <div className="text-center p-4 bg-black/45 border border-dark-border/40 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Time Remaining</span>
              <span className={`text-2xl font-black font-mono ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-3">Question Navigator</span>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded-lg text-xs font-bold border transition-all flex items-center justify-center ${
                      currentIndex === idx
                        ? "bg-physics-purple border-physics-purple text-white ring-2 ring-physics-purple/30"
                        : flagged.includes(idx)
                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                        : responses[idx] !== undefined
                        ? "bg-physics-blue/10 border-physics-blue/30 text-physics-blue-300"
                        : "bg-dark-bg/60 border-dark-border/40 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={completeTest}
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl text-xs tracking-wider transition-all disabled:opacity-50"
            >
              Submit Examination
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
