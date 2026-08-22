import { useState, useEffect } from 'react';
import { Bookmark, Heart, ThumbsDown } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function Saved() {
  const { user, toggleLike, toggleDislike, toggleSave } = useUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedIssues = async () => {
      setLoading(true);
      try {
        const allIssues = await issueService.getAllIssues();
        const savedIssues = allIssues.filter(i => user.savedIssues.includes(i.id));
        setIssues(savedIssues);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedIssues();
  }, [user.savedIssues]);

  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Bookmarks</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Saved Posts</h1>
        <p className="text-zinc-400 text-lg m-0">Everything you wanted to keep track of.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
           <div className="w-8 h-8 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-10 text-center backdrop-blur-md">
          <Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg m-0">You haven't saved any posts yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {issues.map((issue, index) => {
            const isLiked = user.likedIssues.includes(issue.id);
            const isDisliked = user.dislikedIssues.includes(issue.id);
            const isSaved = true; // They are in this list because they are saved
            
            // Calculate dynamic upvotes based on user interactions
            let currentUpvotes = issue.upvotes;
            if (isLiked) currentUpvotes += 1;
            if (isDisliked) currentUpvotes -= 1;

            return (
              <div 
                key={issue.id} 
                className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md transition-all duration-300 animate-fade-in hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-1" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400 text-lg" title="Anonymous Report">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14h20"/><path d="M6.5 14v-2c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v2"/><path d="M12 21v-4"/><path d="M12 2v2"/><path d="M4 14l-2 4h20l-2-4"/></svg>
                  </div>
                  <div>
                    <h4 className="m-0 text-lg font-semibold text-white">{issue.category}</h4>
                    <p className="m-0 text-sm text-zinc-400">
                      Anonymous • {new Date(issue.createdAt).toLocaleDateString()} • {issue.location.address}
                    </p>
                  </div>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                      ${issue.status === 'Submitted' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
                        issue.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                        'bg-green-500/20 text-green-300 border border-green-500/30'}`
                  }>
                    {issue.status}
                  </span>
                </div>
                
                <div className="mb-6">
                  <p className="text-zinc-200 leading-relaxed mb-4">{issue.description}</p>
                  
                  {issue.hashtags && issue.hashtags.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {issue.hashtags.map(tag => (
                         <span key={tag} className="text-accent text-sm">{tag}</span>
                      ))}
                    </div>
                  )}

                  {issue.imageUrl && (
                    <div className="h-64 rounded-xl overflow-hidden border border-dark-border mb-4 bg-black/40">
                      <img src={issue.imageUrl} alt={issue.category} className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-6 pt-4 border-t border-dark-border">
                  <button 
                    onClick={() => toggleLike(issue.id)}
                    className={`flex items-center gap-2 transition-colors bg-transparent border-none cursor-pointer p-0 font-medium ${isLiked ? 'text-accent' : 'text-zinc-400 hover:text-accent'}`}
                  >
                    <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} /> {currentUpvotes} Likes
                  </button>
                  
                  <button 
                    onClick={() => toggleDislike(issue.id)}
                    className={`flex items-center gap-2 transition-colors bg-transparent border-none cursor-pointer p-0 font-medium ${isDisliked ? 'text-red-400' : 'text-zinc-400 hover:text-red-400'}`}
                  >
                    <ThumbsDown className="w-5 h-5" fill={isDisliked ? "currentColor" : "none"} />
                  </button>
                  
                  <button 
                    onClick={() => toggleSave(issue.id)}
                    className={`flex items-center gap-2 transition-colors bg-transparent border-none cursor-pointer p-0 ml-auto font-medium ${isSaved ? 'text-accent' : 'text-zinc-400 hover:text-accent'}`}
                  >
                    <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
