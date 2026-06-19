import React from "react";
import Link from "next/link";

export default function NeetPrep() {
  const syllabus = [
    {
      unit: "General Physics & Mechanics",
      topics: "Units & Dimensions, Vectors, Linear Kinematics, Laws of Motion, Rotational Inertia, Fluid Mechanics",
      weightage: "30-35%",
      difficulty: "Medium",
    },
    {
      unit: "Thermodynamics & Oscillations",
      topics: "Kinetic Theory, Heat Engines, Wave Equations, Organ Pipes, Simple Harmonic Motion (SHM)",
      weightage: "20-25%",
      difficulty: "Medium-Low",
    },
    {
      unit: "Electricity & Magnetism",
      topics: "Gauss's Law, Circuit Analysis (Kirchhoff's), Ampere's Law, Electromagnetic Induction, AC Circuits",
      weightage: "25%",
      difficulty: "Hard",
    },
    {
      unit: "Optics & Semiconductors",
      topics: "Mirror & Lens Formulas, Young's Double Slit, Photoelectric effect, PN Junction Diodes, Logic Gates",
      weightage: "20%",
      difficulty: "Medium-High",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-dark-bg min-h-screen py-16">
      {/* Background elements */}
      <div className="absolute inset-0 physics-grid opacity-15 pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-neet/10 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Indicator */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">
            &larr; Back to Home
          </Link>
        </div>

        {/* Header Hero */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold text-neet tracking-widest uppercase">Targeting NEET Medical 2026/2027</span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mt-2 mb-4 leading-none">
            NEET Medical Physics Program
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Succeed in NEET Physics with lightning-fast numerical calculation drills, conceptual clarity, and focused NCERT mapping. Zero-in on high-yield questions.
          </p>
        </div>

        {/* Core Methodologies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "NCERT alignment",
              desc: "Every concept page maps directly to the NCERT guidelines. No unnecessary calculations, just what you need for NEET.",
              accent: "border-neet",
            },
            {
              title: "Formula Memory Sandboxes",
              desc: "Use interactive visualization flashcards. Connect physical diagrams to formula structures instantly to reduce mental recall times.",
              accent: "border-physics-purple",
            },
            {
              title: "Rapid Time Drills",
              desc: "NEET requires answering questions in under 60 seconds. Train with speed challenges and shortcut math modules.",
              accent: "border-physics-blue",
            },
          ].map((m, idx) => (
            <div key={idx} className={`p-8 rounded-3xl glassmorphism border-t-4 ${m.accent} bg-dark-bg/40`}>
              <h3 className="font-display text-lg font-bold text-white mb-3">{m.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Syllabus breakdown table */}
        <div className="mb-20">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-6">
            NEET Physics Weightage Analysis
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-dark-border/40 glassmorphism bg-dark-bg/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border/40 text-xs font-bold uppercase tracking-wider text-slate-500 bg-white/5">
                  <th className="p-4 sm:p-5">Subject Area</th>
                  <th className="p-4 sm:p-5">Important Topics</th>
                  <th className="p-4 sm:p-5 text-center">Avg Weightage</th>
                  <th className="p-4 sm:p-5 text-right">Difficulty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/30 text-sm">
                {syllabus.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-white whitespace-nowrap">{row.unit}</td>
                    <td className="p-4 sm:p-5 text-slate-400 max-w-md">{row.topics}</td>
                    <td className="p-4 sm:p-5 text-center text-neet font-bold">{row.weightage}</td>
                    <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        row.difficulty === "Hard" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/25"
                          : row.difficulty === "Medium-High"
                          ? "bg-orange-500/10 text-orange-400 border border-orange-500/25"
                          : row.difficulty === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                      }`}>
                        {row.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl glassmorphism border border-neet/20 bg-gradient-to-r from-dark-bg/80 to-[#081b21] p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
              Ready to Practice NEET Speed Drills?
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              Access formula sheets, interactive concepts, and mock NEET examinations. Test your diagnostic accuracy.
            </p>
          </div>
          <div className="flex gap-4 shrink-0 w-full md:w-auto flex-col sm:flex-row">
            <Link
              href="/demo"
              className="py-3.5 px-6 rounded-full bg-neet hover:bg-neet-hover text-white text-sm font-bold transition-all text-center"
            >
              Try Free Sandbox
            </Link>
            <Link
              href="/signup"
              className="py-3.5 px-6 rounded-full glassmorphism hover:bg-white/5 border border-dark-border text-white text-sm font-bold transition-all text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
