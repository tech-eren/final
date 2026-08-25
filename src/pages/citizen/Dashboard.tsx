import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Trophy, Plus, Eye, EyeOff } from 'lucide-react';
import { issueService } from '../../services/issueService';
import type { Issue } from '../../types';
import { useUser } from '../../context/UserContext';
import { format } from 'date-fns';

export function Dashboard() {
  const { user, toggleAnonymity } = useUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // Fetch issues reported by the user (mock user 'usr_1' or just all issues for prototype)
        const data = await issueService.getIssuesByReporter('usr_1');
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const totalReported = issues.length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;
  // Simple arbitrary impact score calculation
  const impactScore = (resolved * 50) + (inProgress * 20) + ((totalReported - resolved - inProgress) * 10);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Submitted': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'In Progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const displayName = user.isAnonymous ? '-----' : user.displayName;

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 animate-slide-down gap-6">
        <div>
          <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Dashboard</span>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="m-0 text-4xl font-bold tracking-tight">Welcome back, {displayName}</h1>
            <button 
              onClick={toggleAnonymity}
              className="p-1.5 mt-1 bg-dark-glass border border-dark-border rounded-lg text-zinc-400 hover:text-accent hover:border-accent transition-all focus:outline-none"
              title={user.isAnonymous ? "Reveal Identity" : "Go Anonymous"}
            >
              {user.isAnonymous ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-zinc-400 text-lg m-0">Here is your civic impact summary.</p>
        </div>
        
        <Link 
          to="/citizen/report"
          className="flex items-center gap-2 bg-dark-card border border-dark-border text-white px-6 py-3 rounded-xl font-medium transition-all hover:bg-white/5 hover:border-accent hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
        >
          <Plus className="w-5 h-5" />
          Report Issue
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:border-accent/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-zinc-400 font-medium">Total Reported</span>
          </div>
          <h2 className="text-4xl font-bold m-0">{totalReported}</h2>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:border-accent/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-zinc-400 font-medium">In Progress</span>
          </div>
          <h2 className="text-4xl font-bold m-0">{inProgress}</h2>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:border-accent/30 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-zinc-400 font-medium">Resolved</span>
          </div>
          <h2 className="text-4xl font-bold m-0">{resolved}</h2>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:border-accent/30 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-zinc-400 font-medium">Impact Score</span>
          </div>
          <h2 className="text-4xl font-bold m-0">{impactScore}</h2>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="flex justify-between items-center p-6 border-b border-dark-border">
          <h3 className="m-0 text-xl font-semibold">Recent Activity</h3>
          <Link to="/citizen/reports" className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>
        
        <div className="flex flex-col">
          {loading ? (
            <div className="p-8 text-center text-zinc-500 animate-pulse">Loading recent activity...</div>
          ) : issues.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No activity yet. Report an issue to get started!</div>
          ) : (
            issues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-dark-border last:border-0 hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="m-0 text-lg font-medium text-white mb-1 truncate">{issue.category}</h4>
                  <p className="m-0 text-zinc-400 text-sm truncate">{issue.location.address}</p>
                </div>
                
                <div className="flex-shrink-0 w-32 flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
                
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-sm text-zinc-500">
                    {format(new Date(issue.createdAt), 'MM/dd/yyyy')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
