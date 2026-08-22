export function Settings() {
  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Preferences</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-zinc-400 text-lg m-0">Manage your account and preferences.</p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-md animate-fade-in mb-8" style={{ animationDelay: '0.1s' }}>
        <h3 className="m-0 mb-6 text-2xl font-semibold text-white">Profile Settings</h3>
        
        <div className="mb-6">
          <label className="block text-zinc-400 text-sm mb-2">Display Name</label>
          <input 
            type="text" 
            className="w-full bg-black/20 border border-dark-border text-white p-4 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all"
            defaultValue="User Name" 
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full bg-black/20 border border-dark-border text-white p-4 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all"
            defaultValue="user@example.com" 
          />
        </div>
        
        <button className="bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white border-none px-6 py-3 rounded-xl font-semibold text-base cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] transition-all">
          Save Changes
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="m-0 mb-2 text-2xl font-semibold text-red-500">Danger Zone</h3>
        <p className="text-zinc-400 mb-6 m-0">Permanently delete your account and all associated data.</p>
        
        <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-semibold text-base cursor-pointer hover:bg-red-500/20 transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
}
