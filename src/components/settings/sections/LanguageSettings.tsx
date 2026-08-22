import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Select } from '../ui/Select';
import { useUser } from '../../../context/UserContext';

export function LanguageSettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.language);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSelect = (key: keyof typeof localSettings) => (val: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings('language', localSettings);
    setHasChanges(false);
    showToast('Language preferences updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Language" subtitle="Choose your preferred language for the interface.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Interface Language</h4>
            <Select 
              value={localSettings.interfaceLanguage} 
              onChange={handleSelect('interfaceLanguage')}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Assamese (অসমীয়া) - Coming Soon', value: 'as' },
                { label: 'Hindi (हिन्दी) - Coming Soon', value: 'hi' },
                { label: 'Bengali (বাংলা) - Coming Soon', value: 'bn' }
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
