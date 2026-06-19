"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  seedChaptersIfEmpty, 
  getChapters, 
  getAllUserChapterProgress, 
  PhysicsChapter, 
  ChapterProgress 
} from "@/lib/db";

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  const [chapters, setChapters] = useState<PhysicsChapter[]>([]);
  const [progress, setProgress] = useState<ChapterProgress[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Sync data on mount or user change
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setDbLoading(true);
      try {
        // 1. Seed database if empty
        await seedChaptersIfEmpty();
        
        // 2. Fetch sorted chapters
        const fetchedChapters = await getChapters();
        setChapters(fetchedChapters);

        // 3. Fetch user progress
        const fetchedProgress = await getAllUserChapterProgress(user.uid);
        setProgress(fetchedProgress);
      } catch (err) {
        console.error("Failed to load dashboard progress data:", err);
      } finally {
        setDbLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) return null;

  const getExamTitle = (key: string) => {
    return key === "jee" ? "JEE Main & Advanced" : "NEET Medical";
  };

  // Calculations for Physics Progress stats
  const totalChapters = chapters.length || 4;
  const completedChaptersList = progress.filter((p) => p.chapterCompleted).map((p) => p.chapterId);
  const completedCount = completedChaptersList.length;
  
  // Custom progress weighting: 15% for each notes section (Mind Map, Concepts, Formulas, Examples) = 60%, 20% Concept Test, 20% Competition Test
  let earnedPoints = 0;
  progress.forEach((p) => {
    let chapterPoints = 0;
    if (p.mindMapCompleted) chapterPoints += 15;
    if (p.conceptsCompleted) chapterPoints += 15;
    if (p.formulaSheetCompleted) chapterPoints += 15;
    if (p.examplesCompleted) chapterPoints += 15;
    if (p.conceptTestScore >= 60) chapterPoints += 20;
    if (p.competitionTestScore >= 70) chapterPoints += 20;
    earnedPoints += chapterPoints;
  });
  const maxPoints = totalChapters * 100;
  const progressPercentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

  // Determine current, completed, and next locked chapters
  const currentChapterId = user.currentChapter;
  const currentChapter = chapters.find((ch) => ch.chapterId === currentChapterId);
  const activeChapterProgress = progress.find((p) => p.chapterId === currentChapterId);
  
  // Next Locked Chapter is the first chapter that has an ID greater than the active currentChapterId
  const nextLockedChapter = chapters.find((ch) => ch.chapterId > currentChapterId);

  // Formulate lists of titles for quick summaries
  const completedTitles = chapters
    .filter((ch) => completedChaptersList.includes(ch.chapterId))
    .map((ch) => ch.title);

  return (
    <div className="relative overflow-hidden bg-dark-bg min-h-[calc(100vh-5rem)] py-12">
      {/* Background grids */}
      <div className="absolute inset-0 physics-grid opacity-15 pointer-events-none"></div>
      <div className="absolute top-[10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-physics-purple/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-physics-blue/10 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-physics-purple tracking-widest uppercase">Student Workspace</span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mt-1">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Here is your physics-specific conceptual roadmap. Track milestones and test performance.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => logout()}
              className="px-6 py-3 rounded-xl border border-dark-border/60 hover:border-red-500/40 text-slate-350 hover:text-red-400 transition-all font-semibold text-sm bg-dark-bg/40 hover:bg-red-500/5"
            >
              Sign Out
            </button>
          </div>
        </div>

        {dbLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-physics-purple mb-4"></div>
            <p className="text-slate-400 text-sm font-medium">Loading Course Metrics...</p>
          </div>
        ) : (
          <>
            {/* Upper Dash Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Profile Overview & Stats Circle */}
              <div className="glassmorphism rounded-3xl p-6 border border-dark-border/40 bg-dark-bg/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-physics-purple to-physics-blue flex items-center justify-center font-display font-black text-white text-lg">
                      {user.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-tight">{user.name}</h3>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-dark-border/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Track Course</span>
                      <span className={`font-semibold px-3 py-1 rounded-full text-xs ${
                        user.exam === "jee" ? "bg-jee/10 text-jee border border-jee/20" : "bg-neet/10 text-neet border border-neet/20"
                      }`}>
                        {getExamTitle(user.exam)} Physics
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Active Level</span>
                      <span className="text-white font-bold">Chapter {user.currentChapter}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Subscription Status</span>
                      <span className="font-semibold px-3 py-1 rounded-full text-xs bg-white/5 border border-dark-border/20 text-slate-400">
                        {user.subscription === "active" ? "Premium Subscriber" : "Free Sandbox Tier"}
                      </span>
                    </div>
                  </div>
                </div>

                {user.subscription !== "active" && (
                  <button
                    onClick={() => alert("Premium memberships are currently in preview mode.")}
                    className="w-full mt-8 py-3 bg-gradient-to-r from-physics-purple to-physics-blue hover:brightness-110 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md shadow-physics-purple/10 text-center"
                  >
                    Upgrade Subscription
                  </button>
                )}
              </div>

              {/* Learning Progress Summary (Continue Action Card) */}
              <div className="glassmorphism rounded-3xl p-6 border border-dark-border/40 bg-dark-bg/30 lg:col-span-2 flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-white mb-2">Physics Progress</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      Syllabus progress index tracks your completed topics and quiz modules across mechanics and electrodynamics.
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-semibold text-slate-450 uppercase tracking-wide">
                        <span>Course Completion</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-dark-bg/85 border border-dark-border/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-physics-purple to-physics-blue transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {completedCount} of {totalChapters} chapter modules completed
                      </p>
                    </div>
                  </div>

                  {/* Circular Radial Gauge */}
                  <div className="flex justify-center">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          className="stroke-dark-border/20 fill-none"
                          strokeWidth="10"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          className="stroke-physics-purple fill-none transition-all duration-700"
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 56}
                          strokeDashoffset={2 * Math.PI * 56 * (1 - progressPercentage / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="font-display font-black text-2xl text-white">{progressPercentage}%</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-dark-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Active Study Target</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {currentChapter ? `Chapter ${currentChapter.chapterId}: ${currentChapter.title}` : "Syllabus Completed!"}
                    </p>
                  </div>
                  {currentChapter ? (
                    <Link
                      href={`/chapters/${currentChapter.chapterId}`}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-physics-purple to-physics-blue hover:brightness-110 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md shadow-physics-purple/20 text-center flex items-center justify-center gap-2 group"
                    >
                      Continue Learning
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-dark-border/40 text-slate-500 rounded-xl font-bold text-xs tracking-wider text-center cursor-not-allowed"
                    >
                      Syllabus Mastered
                    </button>
                  )}
                </div>

                {currentChapter && (
                  <div className="pt-4 mt-4 border-t border-dark-border/20">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-3">Active Chapter Checklist</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { name: "Mind Map", completed: activeChapterProgress?.mindMapCompleted },
                        { name: "Concepts Deck", completed: activeChapterProgress?.conceptsCompleted },
                        { name: "Formula Sheets", completed: activeChapterProgress?.formulaSheetCompleted },
                        { name: "Solved Examples", completed: activeChapterProgress?.examplesCompleted },
                        { name: `Concept Test (${activeChapterProgress?.conceptTestScore || 0}%)`, completed: (activeChapterProgress?.conceptTestScore || 0) >= 60 },
                        { name: `Competition Test (${activeChapterProgress?.competitionTestScore || 0}%)`, completed: (activeChapterProgress?.competitionTestScore || 0) >= 70 },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs p-2.5 rounded-xl border ${
                          item.completed 
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-semibold" 
                            : "bg-white/5 border-dark-border/20 text-slate-400"
                        }`}>
                          {item.completed ? (
                            <svg className="w-3.5 h-3.5 text-emerald-450 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-700 shrink-0"></div>
                          )}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostics Tracker Overview Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Completed Chapters List */}
              <div className="glassmorphism rounded-3xl p-6 border border-dark-border/40 bg-dark-bg/30">
                <h3 className="font-display font-extrabold text-lg text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed Chapters
                </h3>
                {completedTitles.length > 0 ? (
                  <ul className="space-y-2.5">
                    {completedTitles.map((title, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                        <span>{title}</span>
                        <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Passed</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic py-4">No chapters completed yet. Start with Chapter 1 to unlock progress.</p>
                )}
              </div>

              {/* Next Locked Chapter Detail */}
              <div className="glassmorphism rounded-3xl p-6 border border-dark-border/40 bg-dark-bg/30">
                <h3 className="font-display font-extrabold text-lg text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Next Locked Chapter
                </h3>
                {nextLockedChapter ? (
                  <div className="p-4 rounded-xl border border-dark-border/30 bg-dark-bg/40 text-sm text-slate-400">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white text-base">
                        Chapter {nextLockedChapter.chapterId}: {nextLockedChapter.title}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Locked</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Unlocks immediately upon finishing the active diagnostic exercises in the previous module.
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic py-4">
                    {currentChapter ? "No more locked modules. You are on the final chapter!" : "Syllabus fully unlocked!"}
                  </p>
                )}
              </div>
            </div>

            {/* Course Timeline Timeline */}
            <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-dark-border/40 bg-dark-bg/30">
              <h3 className="font-display font-extrabold text-xl text-white mb-6">
                Your Complete Physics Learning Journey
              </h3>

              <div className="space-y-4">
                {chapters.map((ch) => {
                  const isCompleted = completedChaptersList.includes(ch.chapterId);
                  const isActive = ch.chapterId === currentChapterId;
                  const isLocked = ch.chapterId > currentChapterId;
                  const chProgress = progress.find((p) => p.chapterId === ch.chapterId);

                  return (
                    <div
                      key={ch.chapterId}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? "bg-physics-purple/10 border-physics-purple/40 text-white"
                          : isCompleted
                          ? "bg-emerald-500/5 border-emerald-500/10 text-slate-350"
                          : "bg-white/5 border-transparent text-slate-450 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display ${
                          isActive
                            ? "bg-physics-purple text-white"
                            : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-dark-bg/85 border border-dark-border/40 text-slate-500"
                        }`}>
                          {ch.chapterId}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{ch.title}</h4>
                          <p className="text-xs text-slate-500">Module chapter order {ch.order}</p>
                          {(isActive || isCompleted) && (
                            <div className="flex flex-wrap gap-2 mt-3 text-[10px]">
                              {[
                                { name: "Mind Map", completed: chProgress?.mindMapCompleted },
                                { name: "Concepts", completed: chProgress?.conceptsCompleted },
                                { name: "Formulas", completed: chProgress?.formulaSheetCompleted },
                                { name: "Examples", completed: chProgress?.examplesCompleted },
                                { name: "Concept Test", completed: (chProgress?.conceptTestScore || 0) >= 60 },
                                { name: "Comp Test", completed: (chProgress?.competitionTestScore || 0) >= 70 },
                              ].map((milestone, idx) => (
                                <span 
                                  key={idx} 
                                  className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 font-semibold ${
                                    milestone.completed 
                                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                                      : "bg-white/5 border-dark-border/20 text-slate-500"
                                  }`}
                                >
                                  {milestone.completed ? "✓" : "○"} {milestone.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {isCompleted ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                            Completed
                          </span>
                        ) : isActive ? (
                          <>
                            <span className="px-3 py-1 rounded-full bg-physics-purple/20 text-physics-purple text-xs font-semibold border border-physics-purple/30 animate-pulse">
                              In Progress
                            </span>
                            <Link
                              href={`/chapters/${ch.chapterId}`}
                              className="px-4 py-2 bg-physics-purple hover:bg-physics-purple/90 text-white text-xs font-bold rounded-xl transition-all"
                            >
                              Enter Chapter
                            </Link>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-dark-border/60 text-slate-650 text-xs font-semibold">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
