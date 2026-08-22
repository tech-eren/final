import React from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Download, FileText, History, Trash2 } from 'lucide-react';

export function DataPrivacySettings() {
  return (
    <div className="space-y-6">
      <SettingsCard title="Data & Privacy" subtitle="Manage your personal data and platform activity.">
        
        <div className="space-y-4">
          <button className="w-full bg-black/20 hover:bg-black/40 border border-zinc-800 hover:border-zinc-700 text-white p-5 rounded-xl text-left transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-accent/20 group-hover:text-accent transition-colors flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-base font-semibold text-white m-0 mb-1 group-hover:text-accent transition-colors">Download My Data</h5>
              <p className="text-zinc-500 text-sm m-0">Request a copy of all your personal information, settings, and profile data.</p>
            </div>
          </button>

          <button className="w-full bg-black/20 hover:bg-black/40 border border-zinc-800 hover:border-zinc-700 text-white p-5 rounded-xl text-left transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-accent/20 group-hover:text-accent transition-colors flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-base font-semibold text-white m-0 mb-1 group-hover:text-accent transition-colors">Export My Reports</h5>
              <p className="text-zinc-500 text-sm m-0">Download a CSV or PDF containing all the civic reports you have submitted.</p>
            </div>
          </button>

          <button className="w-full bg-black/20 hover:bg-black/40 border border-zinc-800 hover:border-zinc-700 text-white p-5 rounded-xl text-left transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-accent/20 group-hover:text-accent transition-colors flex-shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-base font-semibold text-white m-0 mb-1 group-hover:text-accent transition-colors">View Activity History</h5>
              <p className="text-zinc-500 text-sm m-0">Review your past interactions, comments, likes, and platform activity.</p>
            </div>
          </button>

          <button className="w-full bg-black/20 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 text-white p-5 rounded-xl text-left transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors flex-shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-base font-semibold text-white m-0 mb-1 group-hover:text-red-400 transition-colors">Clear Search History</h5>
              <p className="text-zinc-500 text-sm m-0">Remove all your recent searches from UbiqLoupe and UbiqAI.</p>
            </div>
          </button>
        </div>

      </SettingsCard>
    </div>
  );
}
