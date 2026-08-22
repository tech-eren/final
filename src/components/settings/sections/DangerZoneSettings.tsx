import React, { useState } from 'react';
import { SettingsCard } from '../ui/SettingsCard';
import { ConfirmationModal } from '../ui/ConfirmationModal';

export function DangerZoneSettings() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <SettingsCard title="Danger Zone" subtitle="These actions may permanently affect your account." className="border-red-500/20">
        
        <div className="space-y-4">
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-bold m-0 mb-1">Deactivate Account</h4>
              <p className="text-zinc-400 text-sm m-0">Temporarily disable your account. Your profile and reports will be hidden.</p>
            </div>
            <button 
              onClick={() => setIsDeactivateModalOpen(true)}
              className="bg-transparent border border-red-500/30 text-red-400 px-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-500/10 transition-colors flex-shrink-0"
            >
              Deactivate
            </button>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-bold m-0 mb-1">Delete Account</h4>
              <p className="text-zinc-400 text-sm m-0">Permanently delete your account and associated data. This cannot be undone.</p>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-600/20 border border-red-500 text-red-500 px-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 hover:text-white transition-colors flex-shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </SettingsCard>

      <ConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={() => console.log('Deactivate account')}
        title="Deactivate your account?"
        message="Your profile, reports, and activity will be hidden from the public until you reactivate your account by logging back in."
        confirmText="Deactivate"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => console.log('Delete account')}
        title="Delete your account?"
        message="Your profile, reports, saved posts and associated data may be permanently deleted. This action cannot be undone."
        confirmText="Delete Account"
        isDestructive={true}
      />
    </div>
  );
}
