import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-dark-bg min-h-screen">
      {/* Background Decorative Grid and Glowing Orbs */}
      <div className="absolute inset-0 physics-grid opacity-30 z-0"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-physics-purple/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-physics-blue/10 blur-[120px] pointer-events-none animate-pulse-slow [animation-delay:2s]"></div>
      
      {/* Core Physics Decorative Atoms */}
      <div className="absolute top-[25%] right-[10%] w-60 h-60 rounded-full border border-physics-purple/15 flex items-center justify-center pointer-events-none animate-spin [animation-duration:40s] hidden xl:flex">
        <div className="w-4 h-4 rounded-full bg-physics-purple/35 absolute top-0 left-[50%] -translate-x-1/2"></div>
        <div className="w-48 h-48 rounded-full border border-physics-blue/10 flex items-center justify-center animate-spin [animation-duration:25s] [animation-direction:reverse]">
          <div className="w-3.5 h-3.5 rounded-full bg-physics-blue/40 absolute bottom-0 left-[50%] -translate-x-1/2"></div>
          <div className="w-32 h-32 rounded-full border border-physics-indigo/5 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-physics-purple/20 to-physics-blue/20 blur-sm flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-physics-purple/10 border border-physics-purple/30 text-physics-purple-300 text-xs sm:text-sm font-semibold tracking-wide mb-8 animate-float">
            <svg className="w-4 h-4 text-physics-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Revolutionizing Physics Education
          </div>

          {/* Main Tagline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight text-white mb-6 leading-none">
            Master{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jee to-physics-purple physics-glow-orange">
              JEE Main
            </span>{" "}
            and{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neet to-physics-blue physics-glow-cyan">
              NEET
            </span>
            <br />
            Through Structured Learning
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop memorizing formulas blindly. Physicsrishi breaks down complex physics principles into interactive visualizations and daily learning pathways designed for top percentiles.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto relative group px-8 py-4 rounded-full text-base font-bold text-white overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-physics-purple to-physics-blue transition-transform duration-300 group-hover:scale-105"></span>
              <span className="relative flex items-center justify-center gap-2">
                Start Free Demo
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>

            <a
              href="#exam-options"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-slate-300 hover:text-white glassmorphism border border-dark-border/60 hover:border-physics-purple/35 transition-all duration-300 text-center"
            >
              Browse Prep Paths
            </a>
          </div>
        </div>
      </section>

      {/* Platform Highlight Metrics */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-8 rounded-3xl glassmorphism bg-dark-bg/40 border border-dark-border/30">
          {[
            { metric: "99.8+", label: "Top JEE Percentile" },
            { metric: "180/180", label: "NEET Perfect Score" },
            { metric: "15,000+", label: "Practice Numericals" },
            { metric: "300+", label: "Interactive Simulations" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center flex flex-col justify-center">
              <span className="font-display text-2xl sm:text-3.5xl font-black text-white bg-clip-text bg-gradient-to-b from-white to-slate-400">
                {stat.metric}
              </span>
              <span className="text-slate-500 text-xs sm:text-sm font-medium mt-1 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Exam Options Section */}
      <section id="exam-options" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Select Your Target Exam Pathway
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Choose a path tailored strictly to the exam syllabus, weightage distributions, and conceptual depth required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* JEE Main Card */}
          <div className="group relative rounded-3xl overflow-hidden glassmorphism bg-dark-bg/30 border border-dark-border/40 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-jee/45 hover:shadow-[0_15px_40px_-15px_rgba(249,115,22,0.15)]">
            {/* Corner Accent Color */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-jee/10 blur-2xl rounded-full pointer-events-none group-hover:bg-jee/20 transition-all"></div>
            
            <div>
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-jee/10 text-jee mb-6 border border-jee/20">
                {/* Math/Vector icon for JEE */}
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
                JEE Main & Advanced
              </h3>
              <p className="text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                Unlock high-level logical derivations, integration-based mechanics, and multi-concept problem arrays to push your score past 99% in Physics.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Advanced Mechanics & Gravitation",
                  "Electrostatics & Wave Electrodynamics",
                  "Calculus-driven Problem Sets",
                  "Mock Tests aligned with NTA patterns"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-350 text-sm">
                    <svg className="w-5 h-5 text-jee shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/jee"
              className="w-full text-center py-4 bg-jee/10 hover:bg-jee text-jee hover:text-white font-bold rounded-2xl border border-jee/20 hover:border-transparent transition-all duration-300"
            >
              Explore JEE Pathway
            </Link>
          </div>

          {/* NEET Card */}
          <div className="group relative rounded-3xl overflow-hidden glassmorphism bg-dark-bg/30 border border-dark-border/40 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-neet/45 hover:shadow-[0_15px_40px_-15px_rgba(6,182,212,0.15)]">
            {/* Corner Accent Color */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-neet/10 blur-2xl rounded-full pointer-events-none group-hover:bg-neet/20 transition-all"></div>
            
            <div>
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neet/10 text-neet mb-6 border border-neet/20">
                {/* Stethoscope/Medical Plus icon for NEET */}
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
                NEET Medical Prep
              </h3>
              <p className="text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                Prioritize fast numerical calculation drills, conceptual shortcuts, and high-yield topics to secure 170+ out of 180 in NEET Physics.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "NCERT-focused Conceptual Clarity",
                  "Speed & Accuracy Formula Sheets",
                  "Error Spotting & Diagnostic Drills",
                  "Previous Years' Questions (PYQ) Mastery"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-350 text-sm">
                    <svg className="w-5 h-5 text-neet shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/neet"
              className="w-full text-center py-4 bg-neet/10 hover:bg-neet text-neet hover:text-white font-bold rounded-2xl border border-neet/20 hover:border-transparent transition-all duration-300"
            >
              Explore NEET Pathway
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Learning Advantage */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-physics-purple font-bold text-sm tracking-wider uppercase">The Physicsrishi Advantage</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-3 mb-4">
            A Better Way to Learn Physics
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Traditional coaching dumps formulas. Physicsrishi designs adaptive frameworks to ensure you comprehend the fundamental nature of physical laws.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Structured Pathways",
              desc: "Step-by-step roadmaps keep your daily schedules clear. Move from basic mechanics to quantum analysis without feeling overwhelmed.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              ),
            },
            {
              title: "Interactive Simulations",
              desc: "Watch physics spring to life. Experiment with friction constants, wave superposition, and electric vectors in interactive visual sandboxes.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
            },
            {
              title: "Deep Cognitive Analytics",
              desc: "Don't just see correct/incorrect logs. Identify whether you failed due to a calculus mistake, a misread unit, or a deep conceptual gap.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              ),
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="glassmorphism glassmorphism-hover rounded-3xl p-8 border border-dark-border/30 flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-physics-purple/10 text-physics-purple flex items-center justify-center border border-physics-purple/20 mb-6">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-28">
        <div className="relative rounded-3xl overflow-hidden glassmorphism bg-gradient-to-b from-dark-bg/60 to-dark-bg/90 p-8 sm:p-12 md:p-16 border border-physics-purple/25 text-center">
          {/* Inner Light Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-physics-purple/10 rounded-full blur-[100px] pointer-events-none"></div>

          <h2 className="relative z-10 font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Accelerate Your Physics Learning?
          </h2>
          <p className="relative z-10 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10">
            Sign up for the Free Demo today and experience interactive lessons in Kinematics and Electromagnetism. No credit card required.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto relative group px-8 py-4 rounded-full text-base font-bold text-white overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-physics-purple to-physics-blue transition-transform duration-300 group-hover:scale-105"></span>
              <span className="relative">Access Free Demo</span>
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-slate-350 hover:text-white glassmorphism hover:bg-white/5 border border-dark-border/60 hover:border-physics-purple/35 transition-all duration-300"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
