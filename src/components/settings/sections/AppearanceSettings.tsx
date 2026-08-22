import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { RadioGroup } from '../ui/RadioGroup';
import { useUser } from '../../../context/UserContext';

export function AppearanceSettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.appearance);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSelect = (key: keyof typeof localSettings) => (val: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings('appearance', localSettings);
    setHasChanges(false);
    showToast('Appearance settings updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Appearance" subtitle="Customize how UbiqLoupe looks on your device.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Theme</h4>
            <RadioGroup 
              value={localSettings.theme} 
              onChange={handleSelect('theme')}
              options={[
                { label: 'Dark', value: 'dark', description: 'Deep futuristic aesthetics.' },
                { label: 'Light', value: 'light', description: 'Bright interface for daytime use.' },
                { label: 'System', value: 'system', description: 'Follows your operating system settings.' }
              ]}
            />
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Accent Color</h4>
            <div className="flex gap-4">
              {['purple', 'blue', 'green'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleSelect('accentColor')(color)}
                  className={`w-12 h-12 rounded-full cursor-pointer transition-all border-4 ${
                    localSettings.accentColor === color 
                      ? 'border-white scale-110 shadow-lg' 
                      : 'border-transparent hover:scale-105'
                  } ${
                    color === 'purple' ? 'bg-[#8B5CF6]' : 
                    color === 'blue' ? 'bg-[#3B82F6]' : 'bg-[#10B981]'
                  }`}
                  aria-label={`Select ${color} accent`}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Interface Density</h4>
            <RadioGroup 
              value={localSettings.density} 
              onChange={handleSelect('density')}
              options={[
                { label: 'Compact', value: 'compact', description: 'Fit more information on the screen.' },
                { label: 'Comfortable', value: 'comfortable', description: 'More spacing and larger tap targets.' }
              ]}
            />
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
