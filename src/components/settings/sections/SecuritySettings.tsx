import React from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Monitor, Smartphone } from 'lucide-react';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <SettingsCard title="Security" subtitle="Manage your account security and active sessions.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Authentication</h4>
            <div className="space-y-4">
              <button className="w-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-white px-4 py-4 rounded-xl text-left font-medium transition-colors cursor-pointer flex justify-between items-center">
                <span>Change Password</span>
                <span className="text-zinc-500 text-sm">Last changed 2 months ago</span>
              </button>
              <button className="w-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-white px-4 py-4 rounded-xl text-left font-medium transition-colors cursor-pointer flex justify-between items-center">
                <span>Two-Factor Authentication</span>
                <span className="text-red-400 text-sm bg-red-500/10 px-2 py-1 rounded">Off</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Active Sessions</h4>
            
            <div className="space-y-3">
              <div className="bg-black/20 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-white font-medium m-0 mb-1">Windows • Chrome</h5>
                    <p className="text-sm m-0 text-green-400 font-medium">Active now</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-white font-medium m-0 mb-1">iOS • Safari</h5>
                    <p className="text-sm m-0 text-zinc-500">Last active 2 hours ago</p>
                  </div>
                </div>
                <button className="bg-transparent border border-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer">
                  Log out
                </button>
              </div>
            </div>

            <div className="mt-6">
              <button className="bg-transparent border border-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer">
                Log out of all devices
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
