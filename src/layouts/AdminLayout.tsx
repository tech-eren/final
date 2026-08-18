import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  ShieldCheck,
  Building2,
  BarChart3,
  Settings
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import type { SidebarItem } from '../components/navigation/Sidebar';

const adminNavigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Issues', href: '/admin/issues', icon: ListTodo },
  { name: 'Authorities', href: '/admin/authorities', icon: ShieldCheck },
  { name: 'Departments', href: '/admin/departments', icon: Building2 },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)} 
        showMenuButton={true} 
        userRole="ADMIN" 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={adminNavigation} isOpen={sidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-slate-50">
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
    </div>
  );
}
