import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Home,
  LayoutList,
  FileText,
  User,
  Bookmark,
  Settings
} from 'lucide-react';
import { Sidebar } from '../components/navigation/Sidebar';
import type { SidebarItem } from '../components/navigation/Sidebar';
import { FloatingAssistant } from '../components/ai/FloatingAssistant';
import { AISummarizerPanel } from '../components/ui/AISummarizerPanel';
import { NotificationDropdown } from '../components/navigation/NotificationDropdown';

const citizenNavigation: SidebarItem[] = [
  { name: 'Index', href: '/citizen/dashboard', icon: Home },
  { name: 'Profile', href: '/citizen/profile', icon: User },
  { name: 'Feed', href: '/citizen/feed', icon: LayoutList },
  { name: 'Cases', href: '/citizen/reports', icon: FileText },
  { name: 'Report', href: '/citizen/report', icon: FileText },
  { name: 'Saved Posts', href: '/citizen/saved', icon: Bookmark },
  { name: 'Settings', href: '/citizen/settings', icon: Settings },
];

export function CitizenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <main className="flex-1 w-full max-w-[800px] mx-auto pt-24 lg:pt-16 px-6 lg:px-10 pb-20 focus:outline-none overflow-y-auto">
        <Outlet />
      </main>

      {/* Right Sidebar - AI Summarizer (Optional based on current design) */}
      {/* <AISummarizerPanel /> */}

      {/* AI Assistant */}
      <FloatingAssistant />
    </div>
  );
}
