import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';

export function RootLayout() {
  const location = useLocation();
  
  // Example of how we might determine if the user is in a public vs dashboard route
  const isDashboardRoute = location.pathname.startsWith('/citizen') || 
                           location.pathname.startsWith('/authority') || 
                           location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* On dashboard routes, the specific layouts (CitizenLayout, etc.) might provide their own header/sidebar */}
      {!isDashboardRoute && <Navbar userRole={null} />}
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer can go here for public pages */}
      {!isDashboardRoute && (
        <footer className="py-8 bg-white border-t border-slate-200">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <p className="text-sm text-center text-slate-500">
              © {new Date().getFullYear()} CivicResolve. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
