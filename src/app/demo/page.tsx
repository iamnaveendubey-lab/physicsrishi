"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface TrajectoryPoint {
  x: number;
  y: number;
}

export default function DemoWorkspace() {
  const [activeTab, setActiveTab] = useState("kinematics");
  
  // Projectile Motion Sim States
  const [velocity, setVelocity] = useState(25); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [gravity] = useState(9.8); // m/s^2
  
  const [timeOfFlight, setTimeOfFlight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [range, setRange] = useState(0);
  const [points, setPoints] = useState<TrajectoryPoint[]>([]);

  useEffect(() => {
    // Projectile mechanics formulas
    const rad = (angle * Math.PI) / 180;
    const tFlight = (2 * velocity * Math.sin(rad)) / gravity;
    const maxH = (Math.pow(velocity * Math.sin(rad), 2)) / (2 * gravity);
    const horizRange = (Math.pow(velocity, 2) * Math.sin(2 * rad)) / gravity;

    setTimeOfFlight(tFlight);
    setMaxHeight(maxH);
    setRange(horizRange);

    // Generate points for visual plot path (using normalized scaling)
    const steps = 100;
    const pathPoints: TrajectoryPoint[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (tFlight * i) / steps;
      // x = v * cos(theta) * t
      // y = v * sin(theta) * t - 0.5 * g * t^2
      const x = velocity * Math.cos(rad) * t;
      const y = velocity * Math.sin(rad) * t - 0.5 * gravity * Math.pow(t, 2);
      pathPoints.push({ x, y });
    }
    setPoints(pathPoints);
  }, [velocity, angle, gravity]);

  // Convert trajectory points to SVG path coordinates
  // SVG box is 600 wide by 300 high. Scale points to fit this grid nicely.
  const getSvgPath = () => {
    if (points.length === 0 || range === 0) return "";
    
    const svgWidth = 600;
    const svgHeight = 250;
    
    // Scale factor to map range and max height into SVG bounds
    const scaleX = svgWidth / Math.max(range, 30);
    // Find scale Y so the trajectory curve fits comfortably inside the height
    const scaleY = svgHeight / Math.max(maxHeight * 1.5, 10);
    
    let path = `M 0,${svgHeight}`; // Start bottom left
    
    points.forEach((pt) => {
      const svgX = pt.x * scaleX;
      // SVG 0,0 is top-left, so invert Y
      const svgY = svgHeight - (pt.y * scaleY);
      
      // Keep inside bounds
      const boundedX = Math.min(Math.max(svgX, 0), svgWidth);
      const boundedY = Math.min(Math.max(svgY, 0), svgHeight);
      
      path += ` L ${boundedX.toFixed(1)},${boundedY.toFixed(1)}`;
    });
    
    return path;
  };

  const demoModules = [
    {
      id: "kinematics",
      title: "Projectile Vector Sandbox",
      topic: "Kinematics 2D",
      status: "unlocked",
    },
    {
      id: "electrostatics",
      title: "Point Charge Fields",
      topic: "Electrostatics",
      status: "locked",
    },
    {
      id: "rotation",
      title: "Moment of Inertia Wheel",
      topic: "Rotational Dynamics",
      status: "locked",
    },
    {
      id: "optics",
      title: "Ray Refraction Sandbox",
      topic: "Ray Optics",
      status: "locked",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-dark-bg text-white flex flex-col lg:flex-row">
      <div className="absolute inset-0 physics-grid opacity-10 pointer-events-none"></div>

      {/* Left Sidebar - Module Selectors */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-dark-border/40 bg-dark-bg/60 backdrop-blur-md p-6 flex flex-col shrink-0 relative z-10">
        <h2 className="font-display font-black text-lg text-white mb-6 uppercase tracking-wider">
          Demo Workspace
        </h2>
        <div className="space-y-3 flex-grow">
          {demoModules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => mod.status === "unlocked" && setActiveTab(mod.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                activeTab === mod.id && mod.status === "unlocked"
                  ? "bg-physics-purple/10 border-physics-purple text-white"
                  : mod.status === "locked"
                  ? "opacity-50 border-dark-border/20 text-slate-500 cursor-not-allowed"
                  : "bg-white/5 border-transparent text-slate-350 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-physics-purple">
                  {mod.topic}
                </span>
                <h3 className="text-sm font-bold mt-0.5">{mod.title}</h3>
              </div>
              
              {mod.status === "locked" ? (
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-physics-blue opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-dark-border/30">
          <p className="text-xs text-slate-500 mb-4">
            Unlocking all modules gives you 300+ simulations spanning class 11th & 12th physics.
          </p>
          <Link
            href="/signup"
            className="block text-center py-3 bg-gradient-to-r from-physics-purple to-physics-blue hover:brightness-110 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md shadow-physics-purple/10"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-grow p-6 lg:p-8 flex flex-col relative z-10 max-w-7xl mx-auto w-full">
        {activeTab === "kinematics" ? (
          <div className="flex-grow flex flex-col h-full">
            {/* Header info */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-physics-purple tracking-widest uppercase">Class 11 &bull; Kinematics</span>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  Projectile Motion Interactive Trajectory
                </h1>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Interactive Sandbox
              </div>
            </div>

            {/* Calculations metrics summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Time of Flight", val: `${timeOfFlight.toFixed(2)} s`, color: "border-physics-purple" },
                { label: "Max Altitude (H)", val: `${maxHeight.toFixed(2)} m`, color: "border-jee" },
                { label: "Max Distance (R)", val: `${range.toFixed(2)} m`, color: "border-neet" },
              ].map((m, idx) => (
                <div key={idx} className={`p-4 rounded-2xl glassmorphism border-l-4 ${m.color} bg-dark-bg/30`}>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{m.label}</p>
                  <p className="text-sm sm:text-xl font-black text-white mt-1">{m.val}</p>
                </div>
              ))}
            </div>

            {/* Trajectory Plot Container */}
            <div className="flex-grow min-h-[300px] rounded-3xl glassmorphism bg-dark-bg/20 relative p-4 flex items-end justify-center mb-8 border border-dark-border/30">
              {/* Plot grid axes */}
              <div className="absolute left-6 bottom-6 right-6 top-6 flex flex-col justify-between pointer-events-none opacity-20 border-b border-l border-slate-500">
                <div className="border-t border-dashed border-slate-500 w-full"></div>
                <div className="border-t border-dashed border-slate-500 w-full"></div>
                <div className="border-t border-dashed border-slate-500 w-full"></div>
                <div></div>
              </div>

              {/* Trajectory line rendering */}
              <svg className="w-full h-[250px] overflow-visible max-w-[600px] z-10" viewBox="0 0 600 250">
                {/* SVG Shadow path for glow */}
                <path
                  d={getSvgPath()}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  className="opacity-30 blur-sm"
                />
                {/* Main trajectory path */}
                <path
                  d={getSvgPath()}
                  fill="none"
                  stroke="url(#trajectory-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                
                {/* Simulated projectile circle at highest peak */}
                {points.length > 0 && (
                  <circle
                    cx={(range * (600 / Math.max(range, 30)) * 0.5).toFixed(1)}
                    cy={(250 - maxHeight * (250 / Math.max(maxHeight * 1.5, 10))).toFixed(1)}
                    r="6"
                    className="fill-white stroke-physics-purple stroke-2 physics-glow-purple"
                  />
                )}

                <defs>
                  <linearGradient id="trajectory-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute right-4 bottom-4 text-[10px] text-slate-500 font-bold uppercase">Horizontal Distance (x) &rarr;</div>
              <div className="absolute left-8 top-4 text-[10px] text-slate-500 font-bold uppercase flex flex-col h-full justify-start select-none">
                <span>Altitude (y)</span>
                <span>&uarr;</span>
              </div>
            </div>

            {/* Slider Controls Panel */}
            <div className="p-6 rounded-3xl glassmorphism bg-dark-bg/50 border border-dark-border/40 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Velocity input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-300">Launch Velocity (v₀)</span>
                  <span className="text-xs font-black text-physics-blue">{velocity} m/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={velocity}
                  onChange={(e) => setVelocity(parseInt(e.target.value))}
                  className="w-full accent-physics-blue h-1.5 bg-dark-bg/60 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-semibold mt-1">
                  <span>5 m/s</span>
                  <span>50 m/s</span>
                </div>
              </div>

              {/* Angle input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-300">Launch Angle (&theta;)</span>
                  <span className="text-xs font-black text-jee">{angle}&deg;</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-full accent-jee h-1.5 bg-dark-bg/60 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-semibold mt-1">
                  <span>10&deg;</span>
                  <span>90&deg;</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <svg className="w-16 h-16 text-slate-600 mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">This Module is Locked</h2>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              Create a free account to unlock our entire library of interactive coordinate sandboxes.
            </p>
            <Link
              href="/signup"
              className="px-6 py-3 bg-gradient-to-r from-physics-purple to-physics-blue rounded-full text-sm font-bold text-white hover:brightness-110 transition-all"
            >
              Sign Up For Free
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
