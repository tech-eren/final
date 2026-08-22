import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';
import { useUser } from '../../../context/UserContext';
import { MapPin } from 'lucide-react';

export function LocationSettings({ showToast }: any) {
  const { user, updateSettings } = useUser();
  const [localSettings, setLocalSettings] = useState(user.settings.location);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof typeof localSettings) => (val: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleChange = (key: keyof typeof localSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings(prev => ({ ...prev, [key]: e.target.value }));
    setHasChanges(true);
  };

  const handleSelect = (key: keyof typeof localSettings) => (val: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: val === '5' ? 5 : val === '10' ? 10 : val === '25' ? 25 : 1 }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings('location', localSettings);
    setHasChanges(false);
    showToast('Location preferences updated.');
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Location" subtitle="Manage location-based civic features.">
        
        <div className="space-y-8">
          {/* Location Access */}
          <div className="bg-black/20 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium m-0 mb-1">Location Access</h4>
                <p className={`text-sm m-0 ${localSettings.accessEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {localSettings.accessEnabled ? 'Location permission enabled' : 'Location permission disabled'}
                </p>
              </div>
            </div>
            <button className="bg-transparent border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer">
              Manage Permission
            </button>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Default Area</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2 font-medium">City</label>
                <input 
                  type="text" 
                  className="w-full bg-black/40 border border-dark-border text-white p-3.5 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all hover:border-zinc-600"
                  value={localSettings.defaultCity}
                  onChange={handleChange('defaultCity')}
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2 font-medium">Area / Locality</label>
                <input 
                  type="text" 
                  className="w-full bg-black/40 border border-dark-border text-white p-3.5 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all hover:border-zinc-600"
                  value={localSettings.defaultArea}
                  onChange={handleChange('defaultArea')}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div>
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Nearby Issues</h4>
            <Select 
              label="Nearby Issue Radius" 
              value={localSettings.nearbyRadius.toString()} 
              onChange={handleSelect('nearbyRadius')}
              options={[
                { label: '1 km', value: '1' },
                { label: '5 km', value: '5' },
                { label: '10 km', value: '10' },
                { label: '25 km', value: '25' }
              ]}
            />
            
            <Toggle 
              checked={localSettings.notifyImportantNearby} 
              onChange={handleToggle('notifyImportantNearby')} 
              label="Notify me about important civic issues near me" 
            />
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              When enabled, we periodically check your location to alert you of high-severity issues (like road closures or water outages) within your selected radius.
            </p>
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
