import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { ProfileSettings } from '../../components/settings/sections/ProfileSettings';
import { Toast } from '../../components/settings/ui/Toast';

export function Profile() {
  const { user, toggleAnonymity } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };
  
  // Get first letter for avatar
  const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';
  
  return (
    <div className="animate-fade-in relative">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Your Account</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-zinc-400 text-lg m-0">Manage your public persona.</p>
      </div>
      
      {!isEditing ? (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center backdrop-blur-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
          
          {user.isAnonymous ? (
            <div className="w-24 h-24 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 mx-auto mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14h20"/><path d="M6.5 14v-2c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v2"/><path d="M12 21v-4"/><path d="M12 2v2"/><path d="M4 14l-2 4h20l-2-4"/></svg>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-gradientStart to-accent-gradientEnd flex items-center justify-center font-bold text-white text-4xl mx-auto mb-6 shadow-[0_8px_24px_rgba(139,92,246,0.4)]">
              {initial}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="m-0 text-3xl font-bold text-white">
              {user.isAnonymous ? 'Anonymous' : user.displayName}
            </h2>
            <button 
              onClick={toggleAnonymity}
              className="bg-transparent border-none text-zinc-400 hover:text-white cursor-pointer transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center"
              title={user.isAnonymous ? "Disable Anonymity" : "Enable Anonymity"}
            >
              {user.isAnonymous ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
          
          <p className="text-zinc-400 mb-10 text-lg">
            {user.isAnonymous ? 'Hidden Email' : user.email} • Member since 2026
          </p>
          
          <div className="flex justify-center gap-16 mb-12 bg-black/20 p-6 rounded-2xl border border-dark-border max-w-md mx-auto">
            <div>
              <h3 className="m-0 text-3xl text-white font-bold mb-1">42</h3>
              <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Posts</span>
            </div>
            <div>
              <h3 className="m-0 text-3xl text-white font-bold mb-1">12</h3>
              <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Cases</span>
            </div>
            <div>
              <h3 className="m-0 text-3xl text-white font-bold mb-1">1.2k</h3>
              <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Likes</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white border-none px-8 py-3 rounded-xl font-semibold text-base cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] transition-all"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="animate-fade-in relative">
          <button 
            onClick={() => setIsEditing(false)}
            className="absolute -top-12 right-0 bg-zinc-800 hover:bg-zinc-700 text-white border-none px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer z-10"
          >
            Cancel Editing
          </button>
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden backdrop-blur-md">
            <ProfileSettings 
              showToast={showToast} 
              onSave={() => setIsEditing(false)} 
            />
          </div>
        </div>
      )}

      <Toast 
        isVisible={!!toastMessage} 
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />
    </div>
  );
}
