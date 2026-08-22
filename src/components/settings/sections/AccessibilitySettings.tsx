import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Toggle } from '../ui/Toggle';
import { useUser } from '../../../context/UserContext';

export function AccessibilitySettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.accessibility);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof typeof localSettings) => (val: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings('accessibility', localSettings);
    setHasChanges(false);
    showToast('Accessibility settings updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Accessibility" subtitle="Make the platform easier to use.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Vision & Motion</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.reduceAnimations} onChange={handleToggle('reduceAnimations')} label="Reduce animations" />
              <Toggle checked={localSettings.highContrast} onChange={handleToggle('highContrast')} label="High contrast mode" />
              <Toggle checked={localSettings.largerText} onChange={handleToggle('largerText')} label="Larger text" />
              <Toggle checked={localSettings.reduceTransparency} onChange={handleToggle('reduceTransparency')} label="Reduce transparency" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Navigation</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.screenReader} onChange={handleToggle('screenReader')} label="Screen reader optimization" />
              <Toggle checked={localSettings.keyboardNav} onChange={handleToggle('keyboardNav')} label="Keyboard navigation" />
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
