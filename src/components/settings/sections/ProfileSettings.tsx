import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { useUser } from '../../../context/UserContext';

export function ProfileSettings({ showToast }: any) {
  const { user, updateUser, updateSettings } = useUser();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.settings.profile.phoneNumber);
  const [bio, setBio] = useState(user.settings.profile.bio);

  const hasChanges = 
    displayName !== user.displayName || 
    email !== user.email || 
    phone !== user.settings.profile.phoneNumber || 
    bio !== user.settings.profile.bio;

  const handleSave = () => {
    updateUser({ displayName, email });
    updateSettings('profile', { phoneNumber: phone, bio });
    showToast('Profile updated successfully.');
  };

  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-6">
      <SettingsCard title="Profile Settings" subtitle="Manage your personal information.">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-zinc-800">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-gradientStart to-accent-gradientEnd flex items-center justify-center font-bold text-white text-4xl shadow-[0_8px_24px_rgba(139,92,246,0.4)] flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-xl font-bold text-white m-0">{displayName}</h4>
            <p className="text-zinc-400 text-sm m-0 mb-1">Citizen • Member since August 2026</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white border-none px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                Change Photo
              </button>
              <button className="bg-transparent hover:bg-red-500/10 text-red-400 border border-transparent hover:border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                Remove Photo
              </button>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-zinc-400 text-sm mb-2 font-medium">Display Name</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-dark-border text-white p-3.5 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all hover:border-zinc-600"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-sm mb-2 font-medium">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                className="w-full bg-black/40 border border-dark-border text-white p-3.5 pr-24 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all hover:border-zinc-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-400 text-xs font-semibold bg-green-500/10 px-2 py-1 rounded-md">
                ✓ Verified
              </div>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2 font-medium">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 00000 00000"
              className="w-full bg-black/40 border border-dark-border text-white p-3.5 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all hover:border-zinc-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2 font-medium">Bio</label>
            <textarea 
              rows={3}
              placeholder="Tell the community a bit about yourself..."
              className="w-full bg-black/40 border border-dark-border text-white p-3.5 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all hover:border-zinc-600 resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Action */}
        <div className="mt-8 flex justify-end">
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
