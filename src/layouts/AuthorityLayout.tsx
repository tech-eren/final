import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { FloatingAssistant } from '../components/ai/FloatingAssistant';
import type { SidebarItem } from '../components/navigation/Sidebar';

const authorityNavigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/authority/dashboard', icon: LayoutDashboard },
  { name: 'Issue Management', href: '/authority/issues', icon: ListTodo },
  { name: 'Field Workers', href: '/authority/workers', icon: Users },
  { name: 'Analytics', href: '/authority/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/authority/settings', icon: Settings },
];

export function AuthorityLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)} 
        showMenuButton={true} 
        userRole="AUTHORITY" 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={authorityNavigation} isOpen={sidebarOpen} />
        
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
      <FloatingAssistant role="AUTHORITY" />
    </div>
  );
}
