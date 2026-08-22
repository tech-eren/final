import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';
import { useUser } from '../../../context/UserContext';

export function NotificationSettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.notifications);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof typeof localSettings) => (val: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSelect = (key: keyof typeof localSettings) => (val: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings('notifications', localSettings);
    setHasChanges(false);
    showToast('Notification preferences updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Notifications" subtitle="Choose what you want to be notified about.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Report Updates</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.reportSubmitted} onChange={handleToggle('reportSubmitted')} label="Report submitted" />
              <Toggle checked={localSettings.reportVerified} onChange={handleToggle('reportVerified')} label="Report verified" />
              <Toggle checked={localSettings.reportAssigned} onChange={handleToggle('reportAssigned')} label="Report assigned" />
              <Toggle checked={localSettings.reportStatusChanged} onChange={handleToggle('reportStatusChanged')} label="Report status changed" />
              <Toggle checked={localSettings.reportResolved} onChange={handleToggle('reportResolved')} label="Report resolved" />
              <Toggle checked={localSettings.commentOnReport} onChange={handleToggle('commentOnReport')} label="Comment on my report" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Community</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.communityReplies} onChange={handleToggle('communityReplies')} label="Someone replied to my post" />
              <Toggle checked={localSettings.communitySupport} onChange={handleToggle('communitySupport')} label="Someone supported my report" />
              <Toggle checked={localSettings.petitionUpdates} onChange={handleToggle('petitionUpdates')} label="Petition updates" />
              <Toggle checked={localSettings.nearbyIssues} onChange={handleToggle('nearbyIssues')} label="Nearby civic issues" />
              <Toggle checked={localSettings.trendingIssues} onChange={handleToggle('trendingIssues')} label="Trending civic issues" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Platform</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.platformAnnouncements} onChange={handleToggle('platformAnnouncements')} label="Important announcements" />
              <Toggle checked={localSettings.productUpdates} onChange={handleToggle('productUpdates')} label="Product updates" />
              <Toggle checked={localSettings.securityAlerts} onChange={handleToggle('securityAlerts')} label="Security alerts" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Notification Channels</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.inApp} onChange={handleToggle('inApp')} label="In-app notifications" />
              <Toggle checked={localSettings.email} onChange={handleToggle('email')} label="Email notifications" />
              <Toggle checked={localSettings.push} onChange={handleToggle('push')} label="Push notifications" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Quiet Hours</h4>
            <Toggle checked={localSettings.quietHoursEnabled} onChange={handleToggle('quietHoursEnabled')} label="Enable Quiet Hours" description="Pause non-critical notifications during this time." />
            
            {localSettings.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 mt-4 bg-black/20 p-4 rounded-xl border border-zinc-800/50">
                <Select 
                  label="From" 
                  value={localSettings.quietHoursStart} 
                  onChange={handleSelect('quietHoursStart')}
                  options={[
                    { label: '9:00 PM', value: '21:00' },
                    { label: '10:00 PM', value: '22:00' },
                    { label: '11:00 PM', value: '23:00' },
                    { label: '12:00 AM', value: '00:00' }
                  ]}
                />
                <Select 
                  label="To" 
                  value={localSettings.quietHoursEnd} 
                  onChange={handleSelect('quietHoursEnd')}
                  options={[
                    { label: '6:00 AM', value: '06:00' },
                    { label: '7:00 AM', value: '07:00' },
                    { label: '8:00 AM', value: '08:00' },
                    { label: '9:00 AM', value: '09:00' }
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end pt-6 border-t border-zinc-800">
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-3 rounded-xl font-semibold text-base transition-all flex items-center gap-2 border-none
              ${hasChanges 
                ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)]' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
          >
            Save Changes
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
