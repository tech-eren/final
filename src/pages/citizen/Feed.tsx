import { useState, useEffect } from 'react';
import { Heart, ThumbsDown, Bookmark, MapPin, Globe, Search } from 'lucide-react';
import { issueService } from '../../services/mock/issueService';
import { useUser } from '../../context/UserContext';
import type { Issue } from '../../types';

// Helper to calculate distance in km between two coordinates
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

export function Feed() {
  const { user, toggleLike, toggleDislike, toggleSave } = useUser();
  const [filter, setFilter] = useState<'nearby' | 'global'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for user's actual location
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Attempt to get user's real location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation({ lat: 24.8333, lng: 92.7789 }) // Fallback to Silchar if denied
      );
    } else {
      setUserLocation({ lat: 24.8333, lng: 92.7789 });
    }

    const fetchIssues = async () => {
      setLoading(true);
      try {
        const data = await issueService.getAllIssues();
        setIssues(data);
      } catch (e) {
        console.error("Failed to load feed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const displayedIssues = issues.filter(issue => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = 
        issue.category.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        (issue.hashtags && issue.hashtags.some(tag => tag.toLowerCase().includes(q)));
      if (!matches) return false;
    }

    if (filter === 'global') return true;
    
    // Nearby algorithm: within 100km radius
    if (!userLocation) return true; // Show all while loading location
    const dist = getDistance(
      userLocation.lat, 
      userLocation.lng, 
      issue.location.latitude, 
      issue.location.longitude
    );
    return dist <= 100;
  }).sort((a, b) => {
    // Dynamic upvotes sort taking user context into account
    const getNetUpvotes = (i: Issue) => {
      let net = i.upvotes;
      if (user.likedIssues.includes(i.id)) net += 1;
      if (user.dislikedIssues.includes(i.id)) net -= 1;
      return net;
    };
    return getNetUpvotes(b) - getNetUpvotes(a);
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Community</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Feed</h1>
        <p className="text-zinc-400 text-lg m-0">See what's happening around you.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Tabs */}
        <div className="flex gap-4 bg-black/20 p-2 rounded-2xl w-max border border-dark-border">
          <button 
            onClick={() => setFilter('nearby')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              filter === 'nearby' 
                ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Nearby
          </button>
          <button 
            onClick={() => setFilter('global')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              filter === 'global' 
                ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" /> Global
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-dark-border text-white pl-10 pr-4 py-3 rounded-2xl font-sans text-sm focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all placeholder:text-zinc-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
           <div className="w-8 h-8 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedIssues.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-10 text-center backdrop-blur-md">
              <p className="text-zinc-400 text-lg m-0">No cases found in this area.</p>
            </div>
          ) : (
            displayedIssues.map((issue, index) => {
              const isLiked = user.likedIssues.includes(issue.id);
              const isDisliked = user.dislikedIssues.includes(issue.id);
              const isSaved = user.savedIssues.includes(issue.id);
              
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
            })
          )}
        </div>
      )}
    </div>
  );
}
