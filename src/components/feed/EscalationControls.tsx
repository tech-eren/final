import { useUser } from '../../context/UserContext';
import type { Issue } from '../../types';
import { issueService } from '../../services/issueService';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Megaphone, Flag, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
  issue: Issue;
  onUpdate: (updatedIssue: Issue) => void;
}

export function EscalationControls({ issue, onUpdate }: Props) {
  const { user } = useUser();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleEscalate = async (newState: Issue['escalationState']) => {
    setLoading(true);
    try {
      let updates: Partial<Issue> = { escalationState: newState };
      
      // If moving to PETITION_ACTIVE, initialize petition data
      if (newState === 'PETITION_ACTIVE') {
        updates.petitionData = {
          signatures: 1,
          target: 1000,
          deadline: new Date(Date.now() + 604800000).toISOString(),
          signedBy: [user.id]
        };
      }

      const updated = await issueService.updateIssue(issue.id, updates);
      onUpdate(updated);
      
      addToast({
        title: "Escalation Successful",
        message: newState === 'PETITION_ACTIVE' ? "Community petition started!" : "Issue appealed successfully.",
        type: "success"
      });
    } catch (e) {
      addToast({
        title: "Error",
        message: "Failed to escalate issue.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignPetition = async () => {
    if (!issue.petitionData) return;
    if (issue.petitionData.signedBy.includes(user.id)) {
      addToast({ title: "Already Signed", message: "You have already signed this petition.", type: "info" });
      return;
    }

    setLoading(true);
    try {
      const newSignatures = issue.petitionData.signatures + 1;
      const newSignedBy = [...issue.petitionData.signedBy, user.id];
      
      let updates: Partial<Issue> = {
        petitionData: {
          ...issue.petitionData,
          signatures: newSignatures,
          signedBy: newSignedBy
        }
      };

      if (newSignatures >= issue.petitionData.target) {
        updates.escalationState = 'PETITION_SUBMITTED';
      }

      const updated = await issueService.updateIssue(issue.id, updates);
      onUpdate(updated);
      
      addToast({ title: "Signed!", message: "Thank you for signing the petition.", type: "success" });
    } catch (e) {
      addToast({ title: "Error", message: "Failed to sign petition.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Rule A: Status Badge (Everyone sees this)
  const renderBadge = () => {
    switch (issue.escalationState) {
      case 'PETITION_ACTIVE':
        return (
          <div className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1.5 rounded-full text-xs font-bold border border-accent/30 mb-4 inline-flex">
            <Sparkles className="w-3.5 h-3.5" /> Active Community Petition
          </div>
        );
      case 'PETITION_SUBMITTED':
        return (
          <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold border border-green-500/30 mb-4 inline-flex">
            <Flag className="w-3.5 h-3.5" /> Petition Submitted to Authority
          </div>
        );
      case 'PETITION_ELIGIBLE':
        return (
          <div className="flex items-center gap-1.5 bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-500/30 mb-4 inline-flex">
            <Megaphone className="w-3.5 h-3.5" /> Petition Eligible
          </div>
        );
      case 'APPEAL_1':
      case 'APPEAL_2':
      case 'APPEAL_3':
      case 'MOD_REVIEW':
        return (
          <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 mb-4 inline-flex">
            <Flag className="w-3.5 h-3.5" /> Escalated to {issue.escalationState.replace('_', ' ')}
          </div>
        );
      default:
        return null;
    }
  };

  // Render the Petition Progress Bar if active
  const renderPetitionProgress = () => {
    if (!issue.petitionData || (issue.escalationState !== 'PETITION_ACTIVE' && issue.escalationState !== 'PETITION_SUBMITTED')) return null;
    
    const progress = Math.min((issue.petitionData.signatures / issue.petitionData.target) * 100, 100);
    const hasSigned = issue.petitionData.signedBy.includes(user.id);

    return (
      <div className="bg-black/30 border border-accent/20 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h5 className="text-white font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" /> Signatures
            </h5>
            <p className="text-zinc-400 text-xs mt-1">Goal: {issue.petitionData.target.toLocaleString()}</p>
          </div>
          <div className="text-accent font-bold text-lg">
            {issue.petitionData.signatures.toLocaleString()}
          </div>
        </div>
        
        <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {issue.escalationState === 'PETITION_ACTIVE' && (
          <button
            onClick={handleSignPetition}
            disabled={loading || hasSigned}
            className={`w-full py-2.5 rounded-xl font-medium transition-all ${
              hasSigned
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/30 hover:border-accent shadow-[0_0_15px_rgba(139,92,246,0.15)]'
            }`}
          >
            {loading ? 'Signing...' : hasSigned ? 'You signed this petition' : 'Sign Petition'}
          </button>
        )}
      </div>
    );
  };

  const isReporter = user.id === issue.reportedBy;

  return (
    <div className="w-full">
      {renderBadge()}
      {renderPetitionProgress()}

      {/* Rule B: Action Buttons (Only Reporter sees this) */}
      {isReporter && (
        <div className="flex gap-2 flex-wrap mb-4">
          {(!issue.escalationState || issue.escalationState === 'NONE') && issue.status === 'Submitted' && (() => {
            const daysSinceSubmission = Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 3600 * 24));
            const daysUntilAppeal = Math.max(0, 30 - daysSinceSubmission);
            const canAppeal = daysUntilAppeal === 0;

            return (
              <button 
                onClick={() => handleEscalate('APPEAL_1')}
                disabled={loading || !canAppeal}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                  canAppeal 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' 
                    : 'bg-zinc-800/50 text-zinc-500 border-zinc-800 cursor-not-allowed'
                }`}
              >
                {canAppeal ? 'File Appeal' : `Appeal available in ${daysUntilAppeal} days`}
              </button>
            );
          })()}

          {issue.escalationState === 'PETITION_ELIGIBLE' && (
            <button 
              onClick={() => handleEscalate('PETITION_ACTIVE')}
              disabled={loading}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.4)]"
            >
              Start Community Petition
            </button>
          )}
        </div>
      )}
    </div>
  );
}
