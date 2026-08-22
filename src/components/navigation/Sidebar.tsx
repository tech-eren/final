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
      
      <div className="mt-auto pt-8 border-t border-dark-border flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400 text-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14h20"/><path d="M6.5 14v-2c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v2"/><path d="M12 21v-4"/><path d="M12 2v2"/><path d="M4 14l-2 4h20l-2-4"/></svg>
        </div>
        <div>
          <h4 className="m-0 text-white text-base font-semibold">Anonymous Citizen</h4>
          <p className="m-0 text-zinc-500 text-sm">Incognito Mode</p>
        </div>
      </div>
    </aside>
  );
}
