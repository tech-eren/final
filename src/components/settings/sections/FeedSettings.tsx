import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';
import { useUser } from '../../../context/UserContext';

const ALL_CATEGORIES = [
  'Roads', 'Garbage', 'Water', 'Electricity', 'Pollution', 
  'Public Safety', 'Public Transport', 'Streetlights', 'Parks', 'Traffic', 'Other'
];

export function FeedSettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.feed);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof typeof localSettings) => (val: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSelect = (key: keyof typeof localSettings) => (val: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const toggleCategory = (category: string) => {
    setLocalSettings(prev => {
      const isSelected = prev.issuesCareAbout.includes(category);
      const newCategories = isSelected 
        ? prev.issuesCareAbout.filter(c => c !== category)
        : [...prev.issuesCareAbout, category];
      
      return { ...prev, issuesCareAbout: newCategories };
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings('feed', localSettings);
    setHasChanges(false);
    showToast('Feed preferences updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Feed Preferences" subtitle="Customize the civic issues shown in your feed.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Issues I Care About</h4>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map(category => {
                const isSelected = localSettings.issuesCareAbout.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-accent/20 border-accent/50 text-white' 
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Feed Content</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.showNearby} onChange={handleToggle('showNearby')} label="Nearby issues" />
              <Toggle checked={localSettings.showTrending} onChange={handleToggle('showTrending')} label="Trending issues" />
              <Toggle checked={localSettings.showRecent} onChange={handleToggle('showRecent')} label="Recent reports" />
              <Toggle checked={localSettings.showVerified} onChange={handleToggle('showVerified')} label="Verified reports" />
              <Toggle checked={localSettings.showGovernment} onChange={handleToggle('showGovernment')} label="Government updates" />
              <Toggle checked={localSettings.showDiscussions} onChange={handleToggle('showDiscussions')} label="Community discussions" />
              <Toggle checked={localSettings.showPetitions} onChange={handleToggle('showPetitions')} label="Petitions" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Sort & Filter</h4>
            <div className="space-y-4">
              <Select 
                label="Sort By" 
                value={localSettings.sortBy} 
                onChange={handleSelect('sortBy')}
                options={[
                  { label: 'Trending', value: 'trending' },
                  { label: 'Most Recent', value: 'recent' },
                  { label: 'Nearest', value: 'nearest' },
                  { label: 'Most Supported', value: 'supported' }
                ]}
              />
              
              <div className="space-y-1 pt-2">
                <Toggle checked={localSettings.hideResolved} onChange={handleToggle('hideResolved')} label="Hide resolved issues" />
                <Toggle checked={localSettings.hideDuplicates} onChange={handleToggle('hideDuplicates')} label="Hide duplicate reports" />
              </div>
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
