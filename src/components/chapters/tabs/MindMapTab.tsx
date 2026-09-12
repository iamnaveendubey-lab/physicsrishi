"use client";

import type { MindMapConfig } from "@/types/chapter";
import ContentPlaceholder from "../shared/ContentPlaceholder";

interface MindMapTabProps {
  chapterTitle: string;
  mindMap: MindMapConfig;
  exploredNodes: string[];
  activeNodeId: string | null;
  onExploreNode: (id: string) => void;
}

const NODE_STYLES = [
  {
    border: "border-cyan-400/80",
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    glow: "hover:shadow-cyan-500/20",
    number: "bg-cyan-400/20 text-cyan-300",
  },
  {
    border: "border-emerald-400/80",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    glow: "hover:shadow-emerald-500/20",
    number: "bg-emerald-400/20 text-emerald-300",
  },
  {
    border: "border-orange-400/80",
    text: "text-orange-300",
    dot: "bg-orange-400",
    glow: "hover:shadow-orange-500/20",
    number: "bg-orange-400/20 text-orange-300",
  },
  {
    border: "border-pink-400/80",
    text: "text-pink-300",
    dot: "bg-pink-400",
    glow: "hover:shadow-pink-500/20",
    number: "bg-pink-400/20 text-pink-300",
  },
  {
    border: "border-violet-400/80",
    text: "text-violet-300",
    dot: "bg-violet-400",
    glow: "hover:shadow-violet-500/20",
    number: "bg-violet-400/20 text-violet-300",
  },
  {
    border: "border-blue-400/80",
    text: "text-blue-300",
    dot: "bg-blue-400",
    glow: "hover:shadow-blue-500/20",
    number: "bg-blue-400/20 text-blue-300",
  },
  {
    border: "border-fuchsia-400/80",
    text: "text-fuchsia-300",
    dot: "bg-fuchsia-400",
    glow: "hover:shadow-fuchsia-500/20",
    number: "bg-fuchsia-400/20 text-fuchsia-300",
  },
  {
    border: "border-yellow-400/80",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
    glow: "hover:shadow-yellow-500/20",
    number: "bg-yellow-400/20 text-yellow-300",
  },
  {
    border: "border-lime-400/80",
    text: "text-lime-300",
    dot: "bg-lime-400",
    glow: "hover:shadow-lime-500/20",
    number: "bg-lime-400/20 text-lime-300",
  },
  {
    border: "border-sky-400/80",
    text: "text-sky-300",
    dot: "bg-sky-400",
    glow: "hover:shadow-sky-500/20",
    number: "bg-sky-400/20 text-sky-300",
  },
];

export default function MindMapTab({
  chapterTitle,
  mindMap,
  exploredNodes,
  activeNodeId,
  onExploreNode,
}: MindMapTabProps) {
  if (mindMap.nodes.length === 0) {
    return (
      <ContentPlaceholder section="Mind Map" chapterTitle={chapterTitle} />
    );
  }

  const activeNode = mindMap.nodes.find((node) => node.id === activeNodeId);

  const nodeCount = mindMap.nodes.length;

  return (
    <div className="space-y-8">
      <div className="text-left max-w-3xl">
        <h2 className="font-display font-extrabold text-2xl text-white mb-2">
          Interactive Syllabus Mind Map
        </h2>

        <p className="text-slate-400 text-sm">
          Explore the interconnected branches of this chapter. Click any node to
          study its core equations, definitions, and exam insights.
        </p>

        <div className="mt-3 text-xs font-semibold text-physics-purple">
          Nodes Explored: {exploredNodes.length} of {nodeCount}
        </div>
      </div>

      {/* Horizontal scrolling keeps the radial layout readable on smaller screens. */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="relative min-w-[820px] h-[650px] rounded-3xl border border-dark-border/30 bg-dark-bg/40 overflow-hidden">
          {/* Background rings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-physics-purple/10" />
            <div className="absolute left-1/2 top-1/2 w-[390px] h-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-physics-blue/10" />
            <div className="absolute left-1/2 top-1/2 w-[270px] h-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-physics-purple/5 blur-3xl" />
          </div>

          {/* Connector lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 820 650"
            preserveAspectRatio="none"
          >
            {mindMap.nodes.map((node, index) => {
              const angle = (index / nodeCount) * Math.PI * 2 - Math.PI / 2;

              const radiusX = 315;
              const radiusY = 245;

              const x = 410 + Math.cos(angle) * radiusX;
              const y = 325 + Math.sin(angle) * radiusY;

              const isExplored = exploredNodes.includes(node.id);

              return (
                <line
                  key={node.id}
                  x1="410"
                  y1="325"
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth={isExplored ? "2.5" : "1.5"}
                  className={
                    isExplored ? "text-physics-purple/70" : "text-slate-700/60"
                  }
                />
              );
            })}
          </svg>

          {/* Center node */}
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="w-48 h-36 rounded-full bg-gradient-to-br from-physics-purple via-indigo-500 to-physics-blue border-2 border-white/20 shadow-2xl shadow-physics-purple/30 flex flex-col items-center justify-center text-center px-5">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 mb-1">
                {mindMap.centerSubtitle}
              </span>

              <h4 className="font-display font-black text-white text-lg leading-tight">
                {mindMap.centerLabel}
              </h4>

              <div className="mt-2 text-white/60 text-xs">{chapterTitle}</div>
            </div>
          </div>

          {/* Radial nodes */}
          {mindMap.nodes.map((node, index) => {
            const angle = (index / nodeCount) * Math.PI * 2 - Math.PI / 2;

            const radiusX = 315;
            const radiusY = 245;

            const left = 50 + ((Math.cos(angle) * radiusX) / 820) * 100;
            const top = 50 + ((Math.sin(angle) * radiusY) / 650) * 100;

            const isExplored = exploredNodes.includes(node.id);
            const isActive = activeNodeId === node.id;
            const style = NODE_STYLES[index % NODE_STYLES.length];

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onExploreNode(node.id)}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`z-30 w-[190px] min-h-[76px] px-4 py-3 rounded-2xl border bg-dark-bg/95 backdrop-blur-md text-left shadow-xl transition-all duration-300 ${style.border} ${style.glow} ${
                  isActive
                    ? "scale-110 ring-2 ring-white/30 shadow-2xl"
                    : "hover:scale-105"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${style.number}`}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <div
                      className={`flex items-center gap-2 text-xs font-extrabold leading-tight ${style.text}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}
                      />

                      <span>{node.label}</span>
                    </div>

                    {node.details && (
                      <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 line-clamp-2">
                        {node.details}
                      </p>
                    )}
                  </div>
                </div>

                {isExplored && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-dark-bg">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active node details */}
      {activeNode && (
        <div className="p-6 rounded-3xl glassmorphism border border-physics-purple/30 bg-dark-bg/40">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-physics-purple/15 border border-physics-purple/30 flex items-center justify-center text-physics-purple text-xs font-black">
              ✓
            </div>

            <div>
              <h4 className="font-display font-extrabold text-white text-base mb-2">
                {activeNode.label}
              </h4>

              <p className="text-slate-400 text-sm leading-relaxed">
                {activeNode.details}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
