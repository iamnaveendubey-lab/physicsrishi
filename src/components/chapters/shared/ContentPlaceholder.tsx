interface ContentPlaceholderProps {
  section: string;
  chapterTitle: string;
}

export default function ContentPlaceholder({ section, chapterTitle }: ContentPlaceholderProps) {
  return (
    <div className="p-8 rounded-3xl glassmorphism border border-dark-border bg-dark-bg/80 text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-12 h-12 rounded-full bg-slate-900 border border-dark-border/50 flex items-center justify-center text-slate-500 mb-4">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="font-display font-extrabold text-white text-lg mb-2">{section} Coming Soon</h3>
      <p className="text-slate-500 text-xs sm:text-sm max-w-md">
        Content for <span className="text-slate-400">{chapterTitle}</span> is not yet available. This section will be unlocked when curriculum content is published.
      </p>
    </div>
  );
}
