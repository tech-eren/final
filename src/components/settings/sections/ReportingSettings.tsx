import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';
import { useUser } from '../../../context/UserContext';
import { RadioGroup } from '../ui/RadioGroup';

export function ReportingSettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.reporting);
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
    updateSettings('reporting', localSettings);
    setHasChanges(false);
    showToast('Reporting preferences updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Reporting Preferences" subtitle="Customize how you submit and manage civic reports.">
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Default Settings</h4>
            <div className="space-y-4">
              <Select 
                label="Default Report Category" 
                value={localSettings.defaultCategory} 
                onChange={handleSelect('defaultCategory')}
                options={[
                  { label: 'Roads & Potholes', value: 'Roads' },
                  { label: 'Garbage & Waste', value: 'Garbage' },
                  { label: 'Water Supply', value: 'Water' },
                  { label: 'Electricity & Power', value: 'Electricity' },
                  { label: 'Streetlights', value: 'Streetlights' },
                  { label: 'Pollution', value: 'Pollution' },
                  { label: 'Public Safety', value: 'Public Safety' },
                  { label: 'Public Transport', value: 'Public Transport' },
                  { label: 'Parks & Recreation', value: 'Parks' },
                  { label: 'Other', value: 'Other' }
                ]}
              />
              
              <RadioGroup 
                label="Default Report Visibility"
                value={localSettings.defaultVisibility} 
                onChange={handleSelect('defaultVisibility')}
                options={[
                  { label: 'Public', value: 'public' },
                  { label: 'Anonymous', value: 'anonymous' },
                  { label: 'Private (Authorities Only)', value: 'private' }
                ]}
              />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Location</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.autoUseLocation} onChange={handleToggle('autoUseLocation')} label="Automatically use my current location" />
              <Toggle checked={localSettings.askLocationEveryTime} onChange={handleToggle('askLocationEveryTime')} label="Ask for location every time" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Media</h4>
            <div className="space-y-1">
              <Toggle checked={localSettings.allowPhotos} onChange={handleToggle('allowPhotos')} label="Allow photo uploads" />
              <Toggle checked={localSettings.allowVideos} onChange={handleToggle('allowVideos')} label="Allow video uploads" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Report Status Notifications</h4>
            
            {/* Visual Lifecycle */}
            <div className="flex items-center justify-between my-6 px-2 overflow-x-auto pb-4">
              {['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'].map((stage, idx, arr) => (
                <React.Fragment key={stage}>
                  <div className="flex flex-col items-center gap-2 min-w-[70px]">
                    <div className={`w-4 h-4 rounded-full ${idx === 0 || idx === 1 ? 'bg-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-zinc-700'}`}></div>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${idx === 0 || idx === 1 ? 'text-white' : 'text-zinc-500'}`}>{stage}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 min-w-[20px] ${idx === 0 ? 'bg-accent' : 'bg-zinc-800'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="space-y-1">
              <Toggle checked={localSettings.notifyOnSubmit} onChange={handleToggle('notifyOnSubmit')} label="Notify me when submitted" />
              <Toggle checked={localSettings.notifyOnVerify} onChange={handleToggle('notifyOnVerify')} label="Notify me when verified" />
              <Toggle checked={localSettings.notifyOnAssign} onChange={handleToggle('notifyOnAssign')} label="Notify me when assigned to a department" />
              <Toggle checked={localSettings.notifyOnInProgress} onChange={handleToggle('notifyOnInProgress')} label="Notify me when work is in progress" />
              <Toggle checked={localSettings.notifyOnResolve} onChange={handleToggle('notifyOnResolve')} label="Notify me when resolved" />
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
