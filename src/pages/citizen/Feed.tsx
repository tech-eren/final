import { useState, useEffect } from 'react';
import { Heart, ThumbsDown, Bookmark, MapPin, Search, User, TrendingUp, Landmark, ExternalLink, Activity, Layers, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { issueService } from '../../services/issueService';
import { useToast } from '../../context/ToastContext';
import { useUser } from '../../context/UserContext';
import type { Issue, CivicInsight } from '../../types';

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

type FeedItem = 
  | { kind: 'issue'; issue: Issue }
  | { kind: 'insight'; insight: CivicInsight };

export function Feed() {
  const { user, toggleLike, toggleDislike, toggleSave } = useUser();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'nearby' | 'regional' | 'trending'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  
  // State for user's actual location
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, city?: string, district?: string, state?: string} | null>(null);

  useEffect(() => {
    const fetchLocationData = async (lat: number, lng: number) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`);
        const data = await res.json();
        const addr = data.address || {};
        setUserLocation({
          lat, lng,
          city: addr.city || addr.town || addr.municipality || '',
          district: addr.county || addr.state_district || '',
          state: addr.state || 'Assam'
        });
      } catch (e) {
        setUserLocation({ lat, lng, city: 'Silchar', district: 'Cachar', state: 'Assam' });
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchLocationData(position.coords.latitude, position.coords.longitude),
        () => fetchLocationData(24.8333, 92.7789) // Fallback to Silchar if denied
      );
    } else {
      fetchLocationData(24.8333, 92.7789);
    }
  }, []);

  useEffect(() => {
    if (!userLocation && activeTab !== 'trending') return;
    
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const [{ issues: issueData }, insightData] = await Promise.all([
          issueService.getFeedIssues(
            activeTab,
            userLocation?.lat,
            userLocation?.lng,
            userLocation?.city,
            userLocation?.district,
            userLocation?.state
          ),
          issueService.getCivicInsights(
            activeTab,
            userLocation?.city,
            userLocation?.district,
            userLocation?.state
          )
        ]);
        
        const combined: FeedItem[] = [
          ...issueData.map(issue => ({ kind: 'issue' as const, issue })),
          ...insightData.map(insight => ({ kind: 'insight' as const, insight }))
        ].sort((a, b) => {
          const tA = a.kind === 'issue' ? new Date(a.issue.createdAt).getTime() : new Date(a.insight.timestamp).getTime();
          const tB = b.kind === 'issue' ? new Date(b.issue.createdAt).getTime() : new Date(b.insight.timestamp).getTime();
          return tB - tA;
        });
        
        setFeedItems(combined);
      } catch (e) {
        console.error("Failed to load feed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();

    const handleAiPostsReady = () => { fetchFeed(); };
    window.addEventListener('ai-posts-ready', handleAiPostsReady);
    return () => window.removeEventListener('ai-posts-ready', handleAiPostsReady);
  }, [activeTab, userLocation]);

  const handleSweep = async () => {
    setIsScanning(true);
    try {
      const city = userLocation?.city || 'Silchar';
      const state = userLocation?.state || 'Assam';

      // Fire ALL 3 scope sweeps in PARALLEL so one click fills every tab
      const sweepConfigs = [
        { location: city, scope: 'local' },
        { location: state, scope: 'regional' },
        { location: 'India', scope: 'global' },
      ];

      const results = await Promise.allSettled(
        sweepConfigs.map(async ({ location, scope }) => {
          const res = await fetch(`/api/analyze-live-intel?location=${encodeURIComponent(location)}&scope=${scope}`);
          if (!res.ok) throw new Error(`API returned ${res.status} for ${scope}`);
          return res.json();
        })
      );

      let totalInsights = 0;
      for (const result of results) {
        if (result.status === 'fulfilled' && Array.isArray(result.value) && result.value.length > 0) {
          await issueService.addCivicInsights(result.value);
          totalInsights += result.value.length;
        }
      }

      if (totalInsights === 0) {
        addToast({
          title: "Scan Complete",
          message: "No new civic issues or anomalies found right now. Try again in a minute.",
          type: "info"
        });
      } else {
        addToast({
          title: "Insights Found",
          message: `Discovered ${totalInsights} new civic insights across local, regional, and national feeds.`,
          type: "success"
        });
      }

      // Re-fetch the feed for the current tab to show new data
      const [{ issues: issueData }, insightData] = await Promise.all([
        issueService.getFeedIssues(activeTab, userLocation?.lat, userLocation?.lng, userLocation?.city, userLocation?.district, userLocation?.state),
        issueService.getCivicInsights(activeTab, userLocation?.city, userLocation?.district, userLocation?.state)
      ]);
      const combined: FeedItem[] = [
        ...issueData.map(issue => ({ kind: 'issue' as const, issue })),
        ...insightData.map(insight => ({ kind: 'insight' as const, insight }))
      ].sort((a, b) => {
        const tA = a.kind === 'issue' ? new Date(a.issue.createdAt).getTime() : new Date(a.insight.timestamp).getTime();
        const tB = b.kind === 'issue' ? new Date(b.issue.createdAt).getTime() : new Date(b.insight.timestamp).getTime();
        return tB - tA;
      });
      setFeedItems(combined);

    } catch (e) {
      console.error('Failed to run sweep', e);
      addToast({
        title: "Scan Failed",
        message: "Unable to connect to the live analysis service.",
        type: "error"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const displayedItems = feedItems.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (item.kind === 'issue') {
        const issue = item.issue;
        return issue.category.toLowerCase().includes(q) ||
               issue.description.toLowerCase().includes(q) ||
               (issue.hashtags && issue.hashtags.some(tag => tag.toLowerCase().includes(q)));
      } else {
        const insight = item.insight;
        return insight.title.toLowerCase().includes(q) ||
               insight.description.toLowerCase().includes(q) ||
               insight.actionSuggested.toLowerCase().includes(q);
      }
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Community</span>
          <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Feed</h1>
          <p className="text-zinc-400 text-lg m-0">See what's happening around you.</p>
        </div>
        
        <button
          onClick={handleSweep}
          disabled={loading || isScanning}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-accent/30 w-full md:w-auto
            ${(loading || isScanning) 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-accent/10 text-accent hover:bg-accent hover:text-white hover:shadow-[0_4px_12px_rgba(139,92,246,0.4)]'
            }`}
        >
          {isScanning ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</>
          ) : (
            <><RefreshCw className="w-4 h-4" /> Run Live Internet Sweep</>
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex gap-2 bg-black/20 p-2 rounded-2xl w-max border border-dark-border">
            <button 
              onClick={() => setActiveTab('nearby')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'nearby' 
                  ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" /> Nearby
            </button>
            <button 
              onClick={() => setActiveTab('regional')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'regional' 
                  ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4" /> Regional
            </button>
            <button 
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'trending' 
                  ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Trending
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search feed..."
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
          {displayedItems.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center backdrop-blur-md">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-white font-semibold text-xl mb-2">No data yet in this area</h3>
              <p className="text-zinc-400 mb-1">Click "Run Live Internet Sweep" to discover insights or check back later.</p>
              <p className="text-zinc-500 text-sm">You can also <a href="/citizen/report" className="text-accent underline underline-offset-2">report an issue</a> you've spotted directly.</p>
            </div>
          ) : (
            displayedItems.map((item, index) => {
              if (item.kind === 'issue') {
                const issue = item.issue;
                const isLiked = user.likedIssues.includes(issue.id);
                const isDisliked = user.dislikedIssues.includes(issue.id);
                const isSaved = user.savedIssues.includes(issue.id);
                
                let currentUpvotes = issue.upvotes;
                if (isLiked) currentUpvotes += 1;
                if (isDisliked) currentUpvotes -= 1;

                return (
                  <div 
                    key={issue.id} 
                    className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md transition-all duration-300 animate-fade-in hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-1" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      {issue.source === 'user' ? (
                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                          <User className="w-3 h-3" /> Citizen Reported
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full text-xs font-medium border border-zinc-700">
                           Reported
                        </div>
                      )}
                      
                      {issue.sourceUrl && (
                        <a href={issue.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="View Source">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400 text-lg" title="Anonymous Report">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14h20"/><path d="M6.5 14v-2c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v2"/><path d="M12 21v-4"/><path d="M12 2v2"/><path d="M4 14l-2 4h20l-2-4"/></svg>
                      </div>
                      <div>
                        <h4 className="m-0 text-lg font-semibold text-white">{issue.category}</h4>
                        <p className="m-0 text-sm text-zinc-400 flex items-center gap-1 mt-1">
                          Anonymous • {new Date(issue.createdAt).toLocaleDateString()} 
                          <span className="flex items-center ml-2 text-zinc-300">
                            <MapPin className="w-3 h-3 mr-1" />
                            {[issue.location.city, issue.location.district, issue.location.state].filter(Boolean).join(', ') || issue.location.address}
                          </span>
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
              } else {
                const insight = item.insight;
                const severityColors = {
                  low: 'border-l-blue-500',
                  medium: 'border-l-yellow-500',
                  high: 'border-l-orange-500',
                  critical: 'border-l-red-500'
                };
                const borderColor = severityColors[insight.severity] || 'border-l-zinc-500';
                const TypeIcon = insight.type === 'anomaly' ? Activity : insight.type === 'cluster' ? Layers : Lightbulb;

                return (
                  <div 
                    key={insight.id} 
                    className={`bg-dark-card border-y border-r border-l-4 ${borderColor} border-dark-border rounded-2xl p-6 backdrop-blur-md transition-all duration-300 animate-fade-in hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-1`} 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      {insight.source === 'live-scrape' ? (
                        <div className="flex items-center gap-1.5 bg-violet-500/10 text-violet-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-violet-500/30">
                          AI Scraped
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full text-xs font-medium border border-zinc-700">
                          Insight
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-400">
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="m-0 text-lg font-semibold text-white">{insight.title}</h4>
                        <p className="m-0 text-sm text-zinc-400 flex items-center gap-1 mt-1">
                          {new Date(insight.timestamp).toLocaleDateString()}
                          <span className="flex items-center ml-2 text-zinc-300">
                            <MapPin className="w-3 h-3 mr-1" />
                            {[insight.city, insight.district, insight.state].filter(Boolean).join(', ') || 'Global'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-zinc-200 leading-relaxed mb-4">{insight.description}</p>
                      
                      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                        <h5 className="text-accent font-semibold text-sm mb-2 uppercase tracking-wide">AI Recommendation</h5>
                        <p className="text-zinc-300 text-sm m-0">{insight.actionSuggested}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      )}
    </div>
  );
}
