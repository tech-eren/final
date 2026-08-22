import { Bookmark } from 'lucide-react';

export function Saved() {
  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Bookmarks</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Saved Posts</h1>
        <p className="text-zinc-400 text-lg m-0">Everything you wanted to keep track of.</p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md transition-all duration-300 animate-fade-in hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14h20"/><path d="M6.5 14v-2c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v2"/><path d="M12 21v-4"/><path d="M12 2v2"/><path d="M4 14l-2 4h20l-2-4"/></svg>
          </div>
          <div>
            <h4 className="m-0 text-lg font-semibold text-white">Anonymous</h4>
            <p className="m-0 text-sm text-zinc-400">Incognito • 5h ago</p>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-zinc-200 leading-relaxed m-0">The new park renovations are looking amazing! Attached a few photos of the new playground equipment. Great job city council! 🌳🏞️</p>
        </div>
        <div className="flex items-center pt-4 border-t border-dark-border">
          <button className="flex items-center gap-2 text-accent transition-colors bg-transparent border-none cursor-pointer p-0 font-medium">
            <Bookmark className="w-5 h-5 fill-current" /> Saved
          </button>
        </div>
      </div>
    </div>
  );
}
