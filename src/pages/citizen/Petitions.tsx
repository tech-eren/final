import { useState, useEffect } from 'react';
import { Users, TrendingUp, MapPin, Loader2, Info } from 'lucide-react';
import { issueService } from '../../services/issueService';
import { EscalationControls } from '../../components/feed/EscalationControls';
import type { Issue } from '../../types';

export function Petitions() {
  const [activeTab, setActiveTab] = useState<'nearby' | 'trending'>('nearby');
  const [petitions, setPetitions] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetitions();
  }, [activeTab]);

  const fetchPetitions = async () => {
    setLoading(true);
    try {
      const allIssues = await issueService.getAllIssues();
      // Filter for issues that are active or submitted petitions
      let filtered = allIssues.filter(i => 
        i.escalationState === 'PETITION_ACTIVE' || i.escalationState === 'PETITION_SUBMITTED'
      );

      if (activeTab === 'trending') {
        filtered.sort((a, b) => (b.petitionData?.signatures || 0) - (a.petitionData?.signatures || 0));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      setPetitions(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Community Action</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Active Petitions</h1>
        <p className="text-zinc-400 text-lg m-0">Sign and support issues that matter to your community.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex bg-black/20 p-2 rounded-2xl w-max border border-dark-border">
          <button 
            onClick={() => setActiveTab('nearby')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'nearby' 
                ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Near You
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

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-200 text-sm m-0 leading-relaxed">
          Petitions require 1,000 signatures from verified local residents to automatically trigger a 14-day SLA response from the Municipal Authority.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : petitions.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center backdrop-blur-md">
          <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-xl mb-2">No Active Petitions</h3>
          <p className="text-zinc-400">There are no petitions currently active in this area.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {petitions.map(issue => (
            <div key={issue.id} className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md transition-all hover:border-accent/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <h3 className="text-xl font-bold text-white mb-2">{issue.category}</h3>
              <p className="text-zinc-400 text-sm mb-4">{issue.location.address}</p>
              <p className="text-zinc-300 mb-6">{issue.description}</p>
              
              <EscalationControls 
                issue={issue} 
                onUpdate={(updated) => {
                  setPetitions(prev => prev.map(p => p.id === updated.id ? updated : p));
                }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
