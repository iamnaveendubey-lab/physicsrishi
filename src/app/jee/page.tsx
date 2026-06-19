import React from "react";
import Link from "next/link";

export default function JeePrep() {
  const syllabus = [
    {
      unit: "Classical Mechanics",
      topics: "Kinematics, Newton's Laws, Work-Energy-Power, Rotational Dynamics, Gravitation",
      weightage: "25-30%",
      difficulty: "Hard",
    },
    {
      unit: "Electrodynamics",
      topics: "Electrostatics, Current Electricity, Magnetic Effects, EMI & AC, Electromagnetic Waves",
      weightage: "30-35%",
      difficulty: "Very Hard",
    },
    {
      unit: "Thermal Physics & Waves",
      topics: "Kinetic Theory, Thermodynamics, Calorimetry, Simple Harmonic Motion, Doppler Effect",
      weightage: "20%",
      difficulty: "Medium",
    },
    {
      unit: "Optics & Modern Physics",
      topics: "Ray Optics, Wave Optics, Dual Nature of Matter, Atoms & Nuclei, Semiconductor Devices",
      weightage: "20%",
      difficulty: "Medium-Hard",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-dark-bg min-h-screen py-16">
      {/* Background elements */}
      <div className="absolute inset-0 physics-grid opacity-15 pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-jee/10 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Indicator */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">
            &larr; Back to Home
          </Link>
        </div>

        {/* Header Hero */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold text-jee tracking-widest uppercase">Targeting IIT JEE 2026/2027</span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mt-2 mb-4 leading-none">
            JEE Main & Advanced Physics
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Master the mathematical rigor and logical depth of JEE physics. Learn to construct equations from first principles rather than memorizing formula shortcuts.
          </p>
        </div>

        {/* Core Methodologies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Calculus-driven Conceptials",
              desc: "From variable acceleration to Gauss's flux integrations, we teach you how to apply calculus step-by-step to physics problems.",
              accent: "border-jee",
            },
            {
              title: "Multi-Concept Problem Sets",
              desc: "IIT JEE rarely asks single-topic questions. Master problems that combine Kinematics, Energy Conservation, and Rotational Mechanics in one.",
              accent: "border-physics-purple",
            },
            {
              title: "Structured 2-Year Path",
              desc: "A meticulous day-by-day blueprint covering all Class 11th mechanics and Class 12th electromagnetic curriculum with milestone assessments.",
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
            JEE Physics Curriculum Breakdown
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-dark-border/40 glassmorphism bg-dark-bg/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border/40 text-xs font-bold uppercase tracking-wider text-slate-500 bg-white/5">
                  <th className="p-4 sm:p-5">Subject Area</th>
                  <th className="p-4 sm:p-5">Syllabus Details</th>
                  <th className="p-4 sm:p-5 text-center">Avg Weightage</th>
                  <th className="p-4 sm:p-5 text-right">Difficulty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/30 text-sm">
                {syllabus.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-white whitespace-nowrap">{row.unit}</td>
                    <td className="p-4 sm:p-5 text-slate-400 max-w-md">{row.topics}</td>
                    <td className="p-4 sm:p-5 text-center text-jee font-bold">{row.weightage}</td>
                    <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        row.difficulty === "Very Hard" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/25"
                          : row.difficulty === "Hard"
                          ? "bg-orange-500/10 text-orange-400 border border-orange-500/25"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
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
        <div className="rounded-3xl glassmorphism border border-jee/20 bg-gradient-to-r from-dark-bg/80 to-[#1e1008] p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
              Ready to Practice JEE Numericals?
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              Access curated mock tests and interactive visual sandboxes inside our demo space. Get instant percentile feedback.
            </p>
          </div>
          <div className="flex gap-4 shrink-0 w-full md:w-auto flex-col sm:flex-row">
            <Link
              href="/demo"
              className="py-3.5 px-6 rounded-full bg-jee hover:bg-jee-hover text-white text-sm font-bold transition-all text-center"
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
