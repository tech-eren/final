export function Dashboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Dashboard</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Index</h1>
        <p className="text-zinc-400 text-lg m-0">Your social platform overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-accent/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl font-bold m-0 bg-gradient-to-br from-accent-gradientStart to-accent-gradientEnd bg-clip-text text-transparent">12</h2>
          <p className="m-0 text-zinc-400 uppercase text-xs font-semibold tracking-wider mt-2">Active Cases</p>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-accent/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-bold m-0 bg-gradient-to-br from-accent-gradientStart to-accent-gradientEnd bg-clip-text text-transparent">342</h2>
          <p className="m-0 text-zinc-400 uppercase text-xs font-semibold tracking-wider mt-2">Community Posts</p>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-accent/30 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-4xl font-bold m-0 bg-gradient-to-br from-accent-gradientStart to-accent-gradientEnd bg-clip-text text-transparent">56</h2>
          <p className="m-0 text-zinc-400 uppercase text-xs font-semibold tracking-wider mt-2">Saved Items</p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-md transition-all duration-300 animate-fade-in hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-accent/30" style={{ animationDelay: '0.4s' }}>
        <h3 className="mt-0 mb-6 text-xl font-semibold">Recent Activity</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b border-dark-border pb-4 last:border-0 last:pb-0">
            <div className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0"></div>
            <p className="m-0 text-zinc-200">Jane Doe liked your report on <strong className="text-white">Pothole on Main St.</strong></p>
            <span className="ml-auto text-zinc-400 text-sm whitespace-nowrap">2m ago</span>
          </div>
          
          <div className="flex items-center gap-4 border-b border-dark-border pb-4 last:border-0 last:pb-0">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></div>
            <p className="m-0 text-zinc-200">Your case <strong className="text-white">Water Main Break</strong> is now In Progress.</p>
            <span className="ml-auto text-zinc-400 text-sm whitespace-nowrap">1h ago</span>
          </div>
          
          <div className="flex items-center gap-4 border-b border-dark-border pb-4 last:border-0 last:pb-0">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-500 flex-shrink-0"></div>
            <p className="m-0 text-zinc-200">You saved Mike Smith's post.</p>
            <span className="ml-auto text-zinc-400 text-sm whitespace-nowrap">5h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
