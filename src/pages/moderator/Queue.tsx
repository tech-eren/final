import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { issueService } from '../../services/issueService';
import type { Issue } from '../../types';

export function Queue() {
  const [queue, setQueue] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const allIssues = await issueService.getAllIssues();
      const modReviewIssues = allIssues.filter(i => i.escalationState === 'MOD_REVIEW');
      setQueue(modReviewIssues);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (issueId: string, decision: 'APPROVE' | 'REJECT') => {
    try {
      const newState = decision === 'APPROVE' ? 'PETITION_ELIGIBLE' : 'NONE';
      await issueService.updateIssue(issueId, { escalationState: newState });
      // Remove from queue
      setQueue(prev => prev.filter(i => i.id !== issueId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Moderator Review Queue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review issues that have reached the 3rd appeal stage. Approve them to allow community petitions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Queue is empty</h3>
          <p className="text-slate-500">All escalated issues have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map(issue => (
            <div key={issue.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{issue.category}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <FileText className="w-4 h-4" /> {issue.id} • {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Awaiting Mod Review
                  </span>
                </div>
                
                <p className="text-slate-700 mb-6">{issue.description}</p>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-6">
                  <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" /> Escalation Warning
                  </h4>
                  <p className="text-sm text-amber-700 m-0">
                    This issue has been appealed 3 times by the reporter. Approving this will upgrade it to Petition Eligible status.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleDecision(issue.id, 'APPROVE')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Approve for Petition
                  </button>
                  <button
                    onClick={() => handleDecision(issue.id, 'REJECT')}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
