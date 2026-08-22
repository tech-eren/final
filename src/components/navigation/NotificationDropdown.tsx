import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Heart, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'status' | 'like' | 'alert';
  time: string;
  read: boolean;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Status Update',
    message: 'Your report "Broken Streetlight on Park Rd" is now In Progress.',
    type: 'status',
    time: '10m ago',
    read: false,
  },
  {
    id: '2',
    title: 'New Like',
    message: 'An anonymous citizen liked your report about the pothole.',
    type: 'like',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    title: 'City Alert',
    message: 'Heavy rain expected this evening. Please drive safely.',
    type: 'alert',
    time: '3h ago',
    read: true,
  }
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'status': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'like': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full bg-dark-glass border border-dark-border text-zinc-300 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-down origin-top-right">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="m-0 text-lg font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs font-medium text-accent hover:text-accent-hover bg-transparent border-none cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="m-0">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 transition-colors hover:bg-white/5 cursor-pointer flex gap-4 ${
                      !notification.read ? 'bg-accent/5' : ''
                    }`}
                    onClick={() => {
                      setNotifications(notifications.map(n => 
                        n.id === notification.id ? { ...n, read: true } : n
                      ));
                    }}
                  >
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className={`m-0 text-sm mb-1 ${!notification.read ? 'font-bold text-white' : 'font-medium text-zinc-300'}`}>
                        {notification.title}
                      </h4>
                      <p className="m-0 text-sm text-zinc-400 line-clamp-2 leading-snug">
                        {notification.message}
                      </p>
                      <span className="block mt-2 text-xs text-zinc-500">
                        {notification.time}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 text-center border-t border-zinc-800 bg-black/20">
            <button className="text-sm font-medium text-zinc-400 hover:text-white bg-transparent border-none cursor-pointer transition-colors">
              View all activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
