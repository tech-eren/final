import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  MapPin,
  Bell, 
  User 
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import type { SidebarItem } from '../components/navigation/Sidebar';

const citizenNavigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/citizen/dashboard', icon: LayoutDashboard },
  { name: 'Report Issue', href: '/citizen/report', icon: FileText },
  { name: 'My Reports', href: '/citizen/reports', icon: FileText },
  { name: 'Nearby Issues', href: '/citizen/nearby', icon: MapPin },
  { name: 'Map', href: '/citizen/map', icon: Map },
  { name: 'Notifications', href: '/citizen/notifications', icon: Bell },
  { name: 'Profile', href: '/citizen/profile', icon: User },
];

export function CitizenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)} 
        showMenuButton={true} 
        userRole="CITIZEN" 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={citizenNavigation} isOpen={sidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Click outside to close mobile sidebar wrapper logic could go here, but omitted for brevity. */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
