import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Toggle } from '../ui/Toggle';
import { RadioGroup } from '../ui/RadioGroup';
import { useUser } from '../../../context/UserContext';
import { Bot } from 'lucide-react';

export function UbiqAISettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.ai);
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
    updateSettings('ai', localSettings);
    setHasChanges(false);
    showToast('UbiqAI preferences updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="UbiqAI" subtitle="Customize your AI-assisted civic experience.">
        
        <div className="space-y-8">
          {/* Main Toggle */}
          <div className="bg-gradient-to-r from-accent/20 to-transparent border border-accent/30 rounded-2xl p-6">
            <Toggle 
              checked={localSettings.enabled} 
              onChange={handleToggle('enabled')} 
              label={
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-accent" />
                  <span className="text-lg font-bold text-white">Enable UbiqAI</span>
                </div>
              }
              description="Turn on the AI assistant to help you draft reports, find related issues, and understand civic data." 
            />
          </div>

          {localSettings.enabled && (
            <>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">AI Features</h4>
                <div className="space-y-1">
                  <Toggle checked={localSettings.helpWrite} onChange={handleToggle('helpWrite')} label="Help write reports" />
                  <Toggle checked={localSettings.improveDescriptions} onChange={handleToggle('improveDescriptions')} label="Improve report descriptions" />
                  <Toggle checked={localSettings.suggestCategories} onChange={handleToggle('suggestCategories')} label="Suggest issue categories" />
                  <Toggle checked={localSettings.detectDuplicates} onChange={handleToggle('detectDuplicates')} label="Detect duplicate reports" />
                  <Toggle checked={localSettings.summarizeIssues} onChange={handleToggle('summarizeIssues')} label="Summarize civic issues" />
                  <Toggle checked={localSettings.explainResponses} onChange={handleToggle('explainResponses')} label="Explain government responses" />
                  <Toggle checked={localSettings.findRelated} onChange={handleToggle('findRelated')} label="Find related reports" />
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Personalization</h4>
                <Toggle 
                  checked={localSettings.useActivityForPersonalization} 
                  onChange={handleToggle('useActivityForPersonalization')} 
                  label="Use my activity to personalize AI recommendations" 
                />
              </div>

              <div className="h-px bg-zinc-800" />

              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">AI Response Style</h4>
                <RadioGroup 
                  value={localSettings.responseStyle} 
                  onChange={handleSelect('responseStyle')}
                  options={[
                    { label: 'Concise', value: 'concise', description: 'Short, direct answers to get things done quickly.' },
                    { label: 'Balanced', value: 'balanced', description: 'A mix of clarity and helpful detail.' },
                    { label: 'Detailed', value: 'detailed', description: 'Comprehensive explanations and thorough analysis.' }
                  ]}
                />
              </div>

              {/* Info Card */}
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 mt-6">
                <p className="text-sm text-zinc-400 m-0 leading-relaxed">
                  <strong className="text-zinc-300">Note:</strong> AI suggestions are designed to assist you, but they may occasionally be inaccurate. Always review AI-generated content before submitting important civic reports.
                </p>
              </div>
            </>
          )}
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
