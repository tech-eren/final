import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ items, isOpen = true }: SidebarProps) {
  return (
    <aside className={`w-[280px] bg-dark-glass backdrop-blur-xl border-r border-dark-border p-8 sticky top-0 h-screen flex-col lg:flex ${isOpen ? 'flex' : 'hidden'}`}>
      <div className="text-3xl font-bold bg-gradient-to-br from-accent-gradientStart to-accent-gradientEnd bg-clip-text text-transparent mb-12 pl-2 tracking-tight">
        UbiqLoupe
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center gap-4 p-4 text-[1.1rem] font-medium rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-accent/10 text-white border border-accent/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isActive ? 'text-accent' : 'group-hover:scale-110 group-hover:text-accent'
                  }`}
                  strokeWidth={2}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
    </aside>
  );
}
