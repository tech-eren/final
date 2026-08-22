import { useState, useEffect } from 'react';
import { MapPin, Clock, ThumbsUp, ThumbsDown, Award } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function ExplorePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'region'>('trending');
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueService.getIssuesByReporter('usr_1');
        // Sort by upvotes if trending, else keep default
        const sorted = activeTab === 'trending' 
          ? [...data].sort((a, b) => b.upvotes - a.upvotes)
          : data;
        setIssues(sorted);
      } catch (error) {
        console.error('Failed to fetch public issues', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [activeTab]);

  const handleVote = (issueId: string, type: 'up' | 'down') => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const currentVote = userVotes[issueId];
        let voteChange = 0;

        if (currentVote === type) {
          // Toggle off
          voteChange = type === 'up' ? -1 : 1;
          setUserVotes(prevVotes => {
            const newVotes = { ...prevVotes };
            delete newVotes[issueId];
            return newVotes;
          });
        } else {
          // Switch vote or new vote
          if (currentVote === 'up' && type === 'down') voteChange = -2;
          else if (currentVote === 'down' && type === 'up') voteChange = 2;
          else voteChange = type === 'up' ? 1 : -1;

          setUserVotes(prevVotes => ({ ...prevVotes, [issueId]: type }));
        }

        const newUpvotes = issue.upvotes + voteChange;
        const isPetition = issue.isPetition || newUpvotes >= 50;
        return { ...issue, upvotes: newUpvotes, isPetition };
      }
      return issue;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6 flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('trending')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'trending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          Trending Posts
        </button>
        <button 
          onClick={() => setActiveTab('region')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'region' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          Region Based (Nearby)
        </button>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="py-12 text-center text-slate-500 animate-pulse">Loading feed...</div>
        ) : issues.map((issue) => (
          <Card key={issue.id} className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-200">
            <div className="p-4 flex items-start gap-4">
              {/* Upvote Column */}
              <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                <button 
                  onClick={() => handleVote(issue.id, 'up')}
                  className={`p-1.5 rounded-md transition-colors ${userVotes[issue.id] === 'up' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'}`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <span className={`font-bold text-sm ${issue.isPetition ? 'text-blue-600' : 'text-slate-700'}`}>
                  {issue.upvotes}
                </span>
                <button 
                  onClick={() => handleVote(issue.id, 'down')}
                  className={`p-1.5 rounded-md transition-colors ${userVotes[issue.id] === 'down' ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:bg-slate-100 hover:text-red-600'}`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {issue.category}
                  </span>
                  {issue.isPetition && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      <Award className="w-3 h-3" />
                      Official Petition
                    </span>
                  )}
                </div>

                <p className="text-slate-800 text-base mb-3 leading-relaxed">
                  {issue.description}
                </p>

                {issue.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 max-h-80">
                    <img 
                      src={issue.imageUrl} 
                      alt={issue.description} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Hashtags */}
                {issue.hashtags && issue.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {issue.hashtags.map(tag => (
                      <span key={tag} className="text-blue-600 text-sm hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span className="truncate max-w-[150px]">{issue.location.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium capitalize
                    ${issue.status === 'Submitted' ? 'bg-slate-100 text-slate-600' : 
                      issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`
                  }>
                    {issue.status}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
