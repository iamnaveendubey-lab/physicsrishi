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

export default function MindMapTab({
  chapterTitle,
  mindMap,
  exploredNodes,
  activeNodeId,
  onExploreNode,
}: MindMapTabProps) {
  if (mindMap.nodes.length === 0) {
    return <ContentPlaceholder section="Mind Map" chapterTitle={chapterTitle} />;
  }

  const activeNode = mindMap.nodes.find((n) => n.id === activeNodeId);

  return (
    <div className="space-y-8">
      <div className="text-left max-w-3xl">
        <h2 className="font-display font-extrabold text-2xl text-white mb-2">Interactive Syllabus Mind Map</h2>
        <p className="text-slate-400 text-sm">
          Explore the interconnected branches of this chapter. Click each node to study its core equations and definitions.
        </p>
        <div className="mt-3 text-xs font-semibold text-physics-purple">
          Nodes Explored: {exploredNodes.length} of {mindMap.nodes.length}
        </div>
      </div>

      <div className="relative w-full h-[500px] border border-dark-border/30 rounded-3xl bg-dark-bg/30 overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-dark-border/10" />
          <div className="w-[500px] h-[500px] rounded-full border border-dark-border/5" />
        </div>

        <div className="z-10 px-6 py-4 rounded-2xl bg-gradient-to-r from-physics-purple to-physics-blue border border-white/20 shadow-lg text-center select-none physics-glow-purple">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{mindMap.centerSubtitle}</span>
          <h4 className="font-display font-black text-white text-base">{mindMap.centerLabel}</h4>
        </div>

        {mindMap.nodes.map((node) => {
          const isExplored = exploredNodes.includes(node.id);
          return (
            <button
              key={node.id}
              onClick={() => onExploreNode(node.id)}
              style={{ position: "absolute", left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-md transition-all duration-300 ${
                isExplored
                  ? "bg-white/5 border-physics-purple text-white"
                  : "bg-dark-bg/60 border-dark-border/50 text-slate-450 hover:border-physics-purple/60 hover:text-white"
              } ${activeNodeId === node.id ? "ring-2 ring-physics-purple/50 scale-105" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isExplored ? "bg-physics-purple" : "bg-slate-700"}`} />
                <span>{node.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {activeNode && (
        <div className="p-6 rounded-3xl glassmorphism border border-physics-purple/30 bg-dark-bg/40 animate-float">
          <h4 className="font-display font-extrabold text-white text-base mb-2">{activeNode.label}</h4>
          <p className="text-slate-400 text-sm leading-relaxed">{activeNode.details}</p>
        </div>
      )}
    </div>
  );
}
