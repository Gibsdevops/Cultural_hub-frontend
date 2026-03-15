import React from 'react';
import { Home, Search, CalendarCheck, Bell, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * BottomNavBar — fixed bottom navigation for tourist interface
 * Visible on all main tourist pages
 */
const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home,          label: 'Home',      path: '/feed' },
    { icon: Search,        label: 'Discover',  path: '/search' },
    { icon: CalendarCheck, label: 'Bookings',  path: '/bookings' },
    { icon: Bell,          label: 'Alerts',    path: '/notifications' },
    { icon: User,          label: 'Profile',   path: '/profile' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 pb-safe"
      style={{
        background: 'rgba(10,6,30,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(253,246,236,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        paddingTop: '10px',
      }}
    >
      {tabs.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 min-w-0 flex-1 transition-transform active:scale-90"
          >
            <div
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
              style={{
                background: isActive ? 'rgba(200,101,27,0.2)' : 'transparent',
              }}
            >
              <Icon
                size={22}
                style={{
                  color: isActive ? '#C8651B' : 'rgba(253,246,236,0.4)',
                  fill: isActive && label === 'Home' ? '#C8651B' : 'none',
                }}
              />
            </div>
            <span
              className="text-xs font-medium leading-none"
              style={{ color: isActive ? '#C8651B' : 'rgba(253,246,236,0.4)' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavBar;