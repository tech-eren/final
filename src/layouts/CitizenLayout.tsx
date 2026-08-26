import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Home,
  LayoutList,
  FileText,
  User,
  Bookmark,
  Settings,
  Map as MapIcon,
  Users,
  Clock
} from 'lucide-react';
import { issueService } from '../services/issueService';
import { Sidebar } from '../components/navigation/Sidebar';
import type { SidebarItem } from '../components/navigation/Sidebar';
import { FloatingAssistant } from '../components/ai/FloatingAssistant';
import { AISummarizerPanel } from '../components/ui/AISummarizerPanel';
import { NotificationDropdown } from '../components/navigation/NotificationDropdown';

const citizenNavigation: SidebarItem[] = [
  { name: 'Feed', href: '/citizen/feed', icon: LayoutList },
  { name: 'Petitions', href: '/citizen/petitions', icon: Users },
  { name: 'Profile', href: '/citizen/profile', icon: User },
  { name: 'My Cases', href: '/citizen/reports', icon: FileText },
  { name: 'Report', href: '/citizen/report', icon: FileText },
  { name: 'Map', href: '/citizen/map', icon: MapIcon },
  { name: 'Saved Posts', href: '/citizen/saved', icon: Bookmark },
  { name: 'Settings', href: '/citizen/settings', icon: Settings },
];

export function CitizenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);
  const location = useLocation();
  const isMapRoute = location.pathname === '/citizen/map';

  const handleTimeTravel = (days: number) => {
    issueService.devTimeTravel(days);
    setTimeMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen max-w-[1400px] mx-auto text-white relative">
      {/* Mobile toggle button (visible on small screens) */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-dark-glass border border-dark-border rounded-xl lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Top Right Actions */}
      <div className="fixed top-4 right-4 lg:top-8 lg:right-8 z-40 flex items-center gap-4">
        {/* Dev Time Travel Tool */}
        <div className="relative">
          <button 
            onClick={() => setTimeMenuOpen(!timeMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Dev Time Travel</span>
          </button>
          
          {timeMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden py-1 z-50">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-dark-border">
                Fast Forward Time
              </div>
              <button onClick={() => handleTimeTravel(30)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                +30 Days (Appeal 1)
              </button>
              <button onClick={() => handleTimeTravel(45)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                +45 Days (Appeal 2)
              </button>
              <button onClick={() => handleTimeTravel(60)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                +60 Days (Mod Review)
              </button>
            </div>
          )}
        </div>

        <NotificationDropdown />
      </div>

      {/* Sidebar */}
      <Sidebar items={citizenNavigation} isOpen={sidebarOpen} />

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full pt-24 lg:pt-16 px-6 lg:px-10 pb-20 focus:outline-none overflow-y-auto ${isMapRoute ? 'max-w-none' : 'max-w-[800px] mx-auto'}`}>
        <Outlet />
      </main>

      {/* Right Sidebar - AI Summarizer (Optional based on current design) */}
      {/* <AISummarizerPanel /> */}

      {/* AI Assistant */}
      <FloatingAssistant />
    </div>
  );
}
