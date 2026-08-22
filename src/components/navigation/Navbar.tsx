import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  userRole?: 'CITIZEN' | 'AUTHORITY' | 'ADMIN' | null;
}

export function Navbar({ onMenuClick, showMenuButton = false, userRole = null }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="p-2 mr-2 text-slate-500 rounded-md hover:text-slate-700 hover:bg-slate-100 focus:outline-none lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link to="/" className="flex items-center flex-shrink-0 gap-2">
              <MapPin className="w-8 h-8 text-primary-600" />
              <span className="hidden text-xl font-bold tracking-tight sm:block text-slate-900">
                UbiqLoupe
              </span>
            </Link>
            
            {/* Public Navigation */}
            {!userRole && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {/* Empty block for now since we removed Home and Explore */}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!userRole ? (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Sign up
                </Link>
                <Button onClick={() => navigate('/report')} size="sm">
                  Report an Issue
                </Button>
              </>
            ) : (
              <>
                <button className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="relative ml-3">
                  <button className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
