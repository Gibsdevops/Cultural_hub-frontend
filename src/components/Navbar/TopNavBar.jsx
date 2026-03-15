import React from 'react';
import { Search, Bell, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * TopNavBar — fixed top navigation for the feed
 *
 * Props:
 *   activeTab   {string}  — 'forYou' | 'following'
 *   onTabChange {func}    — called with new tab name
 */
const TopNavBar = ({ activeTab = 'forYou', onTabChange }) => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-3 pb-3"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)' }}>
          <Compass size={14} color="white" />
        </div>
        <span className="font-display font-bold text-base" style={{ color: '#FDF6EC' }}>
          CulturaTour
        </span>
      </div>

      {/* Center tabs: For You / Following */}
      <div className="flex items-center gap-1 rounded-full p-1"
           style={{ background: 'rgba(255,255,255,0.1)' }}>
        {['forYou', 'following'].map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange?.(tab)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeTab === tab ? '#C8651B' : 'transparent',
              color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.6)',
            }}
          >
            {tab === 'forYou' ? 'For You' : 'Following'}
          </button>
        ))}
      </div>

      {/* Right: Search + Notifications */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/search')}
          className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <Search size={16} color="white" />
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="w-8 h-8 flex items-center justify-center rounded-full relative"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <Bell size={16} color="white" />
          {/* Notification dot */}
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full"
               style={{ backgroundColor: '#F4845F' }} />
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;