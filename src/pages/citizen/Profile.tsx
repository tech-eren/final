export function Profile() {
  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Your Account</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-zinc-400 text-lg m-0">Manage your public persona.</p>
      </div>
      
      <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center backdrop-blur-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-gradientStart to-accent-gradientEnd flex items-center justify-center font-bold text-white text-4xl mx-auto mb-6 shadow-[0_8px_24px_rgba(139,92,246,0.4)]">
          U
        </div>
        <h2 className="m-0 mb-2 text-3xl font-bold text-white">User Name</h2>
        <p className="text-zinc-400 mb-10 text-lg">@username • Member since 2026</p>
        
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
        
        <button className="bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white border-none px-8 py-3 rounded-xl font-semibold text-base cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] transition-all">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
