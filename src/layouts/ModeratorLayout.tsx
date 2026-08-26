import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users,
  Settings
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { FloatingAssistant } from '../components/ai/FloatingAssistant';
import type { SidebarItem } from '../components/navigation/Sidebar';

const moderatorNavigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/moderator/dashboard', icon: LayoutDashboard },
  { name: 'Mod Queue', href: '/moderator/queue', icon: ListTodo },
  { name: 'Community', href: '/moderator/community', icon: Users },
  { name: 'Settings', href: '/moderator/settings', icon: Settings },
];

export function ModeratorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)} 
        showMenuButton={true} 
        userRole="ADMIN" // Using admin or authority for styling
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={moderatorNavigation} isOpen={sidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* AI Assistant */}
      <FloatingAssistant role="ADMIN" />
    </div>
  );
}
