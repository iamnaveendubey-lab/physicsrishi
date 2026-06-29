import type { ChapterTabId } from "@/types/chapter";
import { CHAPTER_TABS } from "@/data/chapters";

interface ChapterTabNavProps {
  activeTab: ChapterTabId;
  onTabChange: (tab: ChapterTabId) => void;
}

export default function ChapterTabNav({ activeTab, onTabChange }: ChapterTabNavProps) {
  return (
    <div className="flex border-b border-dark-border/40 overflow-x-auto gap-2 mb-8 no-scrollbar scroll-smooth">
      {CHAPTER_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-5 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? "border-physics-purple text-white bg-physics-purple/5"
              : "border-transparent text-slate-500 hover:text-slate-350 hover:bg-white/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
