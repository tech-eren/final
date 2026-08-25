import React, { useState } from 'react';
import { 
  User, Bell, Shield, MapPin, Radio, Layout, 
  Settings2, Eye, Type, Lock, Database, AlertTriangle, LogOut, Briefcase 
} from 'lucide-react';

import { Toast } from '../../components/settings/ui/Toast';
import { ProfileSettings } from '../../components/settings/sections/ProfileSettings';
import { NotificationSettings } from '../../components/settings/sections/NotificationSettings';
import { PrivacySettings } from '../../components/settings/sections/PrivacySettings';
import { ReportingSettings } from '../../components/settings/sections/ReportingSettings';
import { LocationSettings } from '../../components/settings/sections/LocationSettings';
import { FeedSettings } from '../../components/settings/sections/FeedSettings';
import { UbiqAISettings } from '../../components/settings/sections/UbiqAISettings';
import { AppearanceSettings } from '../../components/settings/sections/AppearanceSettings';
import { AccessibilitySettings } from '../../components/settings/sections/AccessibilitySettings';
import { LanguageSettings } from '../../components/settings/sections/LanguageSettings';
import { SecuritySettings } from '../../components/settings/sections/SecuritySettings';
import { DataPrivacySettings } from '../../components/settings/sections/DataPrivacySettings';
import { DangerZoneSettings } from '../../components/settings/sections/DangerZoneSettings';

const SETTINGS_TABS = [
  { id: 'notifications', label: 'Notifications', category: 'COMMUNICATION', icon: Bell },
  { id: 'reporting', label: 'Reporting Preferences', category: 'CIVIC EXPERIENCE', icon: Radio },
  { id: 'location', label: 'Location', category: 'CIVIC EXPERIENCE', icon: MapPin },
  { id: 'feed', label: 'Feed Preferences', category: 'CIVIC EXPERIENCE', icon: Layout },
  { id: 'privacy', label: 'Privacy & Safety', category: 'PRIVACY & AI', icon: Shield },
  { id: 'ai', label: 'UbiqAI', category: 'PRIVACY & AI', icon: Settings2 },
  { id: 'appearance', label: 'Appearance', category: 'PERSONALIZATION', icon: Eye },
  { id: 'accessibility', label: 'Accessibility', category: 'PERSONALIZATION', icon: Type },
  { id: 'language', label: 'Language', category: 'PERSONALIZATION', icon: Type },
  { id: 'security', label: 'Security', category: 'SECURITY & DATA', icon: Lock },
  { id: 'data', label: 'Data & Privacy', category: 'SECURITY & DATA', icon: Database },
  { id: 'admin', label: 'Authority Dashboard', category: 'ADMIN', icon: Briefcase },
  { id: 'danger', label: 'Danger Zone', category: 'DANGER ZONE', icon: AlertTriangle, isDanger: true },
  { id: 'logout', label: 'Log Out', category: 'DANGER ZONE', icon: LogOut, isDanger: true }
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [toastMessage, setToastMessage] = useState('');
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Group tabs by category
  const groupedTabs = SETTINGS_TABS.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = [];
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<string, typeof SETTINGS_TABS>);

  const renderContent = () => {
    switch(activeTab) {
      case 'notifications': return <NotificationSettings showToast={showToast} />;
      case 'reporting': return <ReportingSettings showToast={showToast} />;
      case 'location': return <LocationSettings showToast={showToast} />;
      case 'feed': return <FeedSettings showToast={showToast} />;
      case 'privacy': return <PrivacySettings showToast={showToast} />;
      case 'ai': return <UbiqAISettings showToast={showToast} />;
      case 'appearance': return <AppearanceSettings showToast={showToast} />;
      case 'accessibility': return <AccessibilitySettings showToast={showToast} />;
      case 'language': return <LanguageSettings showToast={showToast} />;
      case 'security': return <SecuritySettings />;
      case 'data': return <DataPrivacySettings />;
      case 'danger': return <DangerZoneSettings />;
      default: return <NotificationSettings showToast={showToast} />;
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 animate-slide-down flex-shrink-0">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Preferences</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2 text-white">Settings</h1>
        <p className="text-zinc-400 text-lg m-0">Manage your account, privacy, civic preferences, and UbiqAI experience.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        
        {/* Mobile Dropdown Navigator */}
        <div className="lg:hidden block mb-4 flex-shrink-0">
          <select 
            value={activeTab}
            onChange={(e) => {
              if (e.target.value === 'logout') {
                localStorage.clear();
                window.location.href = '/login';
                return;
              }
              if (e.target.value === 'admin') {
                window.location.href = '/authority/dashboard';
                return;
              }
              setActiveTab(e.target.value);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-4 rounded-xl font-medium focus:outline-none focus:border-accent appearance-none cursor-pointer"
          >
            {Object.entries(groupedTabs).map(([category, tabs]) => (
              <optgroup key={category} label={category} className="bg-zinc-900 text-zinc-500">
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id} className="text-white">
                    {tab.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pb-8">
          {Object.entries(groupedTabs).map(([category, tabs]) => (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">{category}</h3>
              <div className="space-y-0.5">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'logout') {
                          localStorage.clear();
                          window.location.href = '/login';
                          return;
                        }
                        if (tab.id === 'admin') {
                          window.location.href = '/authority/dashboard';
                          return;
                        }
                        setActiveTab(tab.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border-none
                        ${isActive 
                          ? 'bg-gradient-to-r from-accent/20 to-transparent text-white shadow-[inset_2px_0_0_0_#8B5CF6]' 
                          : tab.isDanger 
                            ? 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400 bg-transparent'
                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 bg-transparent'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : tab.isDanger ? 'text-red-400/70' : 'text-zinc-500'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 pb-16 lg:pb-8 lg:overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent px-1">
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            {renderContent()}
          </div>
        </div>
      </div>

      <Toast 
        isVisible={!!toastMessage} 
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />
    </div>
  );
}
