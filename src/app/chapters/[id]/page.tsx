"use client";

import React from "react";
import ChapterWorkspace from "@/components/chapters/ChapterWorkspace";

export default function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const chapterId = parseInt(resolvedParams.id, 10);

  if (isNaN(chapterId)) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-physics-purple" />
      </div>
    );
  }

  return <ChapterWorkspace chapterId={chapterId} />;
}
