import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Toggle } from '../ui/Toggle';
import { RadioGroup } from '../ui/RadioGroup';
import { useUser } from '../../../context/UserContext';
import { Shield } from 'lucide-react';

export function PrivacySettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.privacy);
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
    updateSettings('privacy', localSettings);
    setHasChanges(false);
    showToast('Privacy settings updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Privacy & Safety" subtitle="Control how your identity, reports and location are shared.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Profile Visibility</h4>
            <RadioGroup 
              value={localSettings.profileVisibility} 
              onChange={handleSelect('profileVisibility')}
              options={[
                { label: 'Public', value: 'public', description: 'Anyone on the internet can see your profile.' },
                { label: 'Registered users', value: 'registered', description: 'Only logged-in users can view your profile.' },
                { label: 'Private', value: 'private', description: 'Only authorities and people you approve can see your profile.' }
              ]}
            />
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Report Privacy</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.showNameOnReports} onChange={handleToggle('showNameOnReports')} label="Show my name on public reports" />
              <Toggle checked={localSettings.allowFollowing} onChange={handleToggle('allowFollowing')} label="Allow users to follow my reports" />
              <Toggle checked={localSettings.showOnDiscussions} onChange={handleToggle('showOnDiscussions')} label="Show my profile on civic discussions" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Location Privacy</h4>
            <RadioGroup 
              value={localSettings.locationPrivacy} 
              onChange={handleSelect('locationPrivacy')}
              options={[
                { label: 'Exact location', value: 'exact', description: 'Share pinpoint location when reporting (helps authorities resolve issues faster).' },
                { label: 'Approximate location', value: 'approximate', description: 'Share only the general neighborhood or street.' },
                { label: 'Hide location publicly', value: 'hidden', description: 'Authorities can see the location, but public feed will not.' }
              ]}
            />
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Anonymous Reporting Card */}
          <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-24 h-24 text-accent" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Anonymous Reporting
              </h4>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed max-w-md">
                Submit civic reports without publicly displaying your identity. 
              </p>
              <Toggle 
                checked={localSettings.defaultToAnonymous} 
                onChange={handleToggle('defaultToAnonymous')} 
                label="Default to Anonymous Reporting" 
              />
              <p className="text-xs text-accent mt-3 bg-accent/10 px-3 py-2 rounded border border-accent/20 inline-block">
                Authorities may still receive information required for verification.
              </p>
            </div>
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
