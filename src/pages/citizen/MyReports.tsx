import { useState, useEffect } from 'react';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function MyReports() {
  const [filter, setFilter] = useState<'Submitted' | 'In Progress' | 'Resolved' | 'All'>('All');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIssues = async () => {
      setLoading(true);
      try {
        const data = await issueService.getIssuesByReporter('usr_1');
        setIssues(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyIssues();
  }, []);

  const displayedIssues = issues.filter(issue => filter === 'All' || issue.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Case Tracker</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">My Cases</h1>
        <p className="text-zinc-400 text-lg m-0">Track the status of your reported issues.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {[
          { id: 'All', label: 'All Cases' },
          { id: 'Submitted', label: 'Submitted' },
          { id: 'In Progress', label: 'In Progress' },
          { id: 'Resolved', label: 'Resolved' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${
              filter === f.id
                ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd border-transparent text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]'
                : 'bg-black/20 border-dark-border text-zinc-400 hover:text-white hover:bg-black/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
           <div className="w-8 h-8 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : displayedIssues.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-10 text-center backdrop-blur-md">
          <p className="text-zinc-400 text-lg m-0">No cases found in this category.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedIssues.map((issue, index) => {
             // Calculate progress bar width based on status
             let progress = 0;
             if (issue.status === 'Submitted') progress = 10;
             else if (issue.status === 'In Progress') progress = 60;
             else if (issue.status === 'Resolved') progress = 100;

             return (
              <div 
                key={issue.id}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md transition-all duration-300 animate-fade-in flex flex-col hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-accent/30" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="m-0 text-xl font-semibold text-white">{issue.category}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border
                      ${issue.status === 'Submitted' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                        issue.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 
                        'bg-green-500/20 text-green-300 border-green-500/30'}`
                  }>
                    {issue.status}
                  </span>
                </div>
                
                <p className="text-zinc-400 mb-2 text-sm">{new Date(issue.createdAt).toLocaleDateString()} • {issue.location.address}</p>
                <p className="text-zinc-300 mb-6 text-base line-clamp-2">{issue.description}</p>
                
                <div className="bg-black/40 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                       issue.status === 'Resolved' ? 'bg-green-500' : 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-zinc-500 text-right m-0">
                  {issue.status === 'Submitted' ? 'Awaiting review' : 
                   issue.status === 'In Progress' ? 'City crew assigned' : 
                   'Case closed'}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
