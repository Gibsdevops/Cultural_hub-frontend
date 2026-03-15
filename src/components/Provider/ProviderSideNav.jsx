import React from 'react';
import {
  LayoutDashboard, Upload, Package,
  CalendarCheck, User, LogOut, Compass, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ProviderSideNav — slide-in side navigation for provider dashboard
 *
 * Props:
 *   activeSection  {string}  — current active section key
 *   onSelect       {func}    — called with section key when item tapped
 *   isOpen         {bool}    — controls visibility on mobile
 *   onClose        {func}    — close handler
 */
const ProviderSideNav = ({ activeSection, onSelect, isOpen, onClose }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { key: 'home',     icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { key: 'upload',   icon: <Upload size={18} />,          label: 'Upload Experience' },
    { key: 'packages', icon: <Package size={18} />,         label: 'Packages' },
    { key: 'bookings', icon: <CalendarCheck size={18} />,   label: 'Bookings' },
    { key: 'profile',  icon: <User size={18} />,            label: 'Profile' },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={onClose}
        />
      )}

      {/* ── Side Nav Panel ── */}
      <div
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: '260px',
          background: 'rgba(10,6,30,0.98)',
          borderRight: '1px solid rgba(253,246,236,0.07)',
        }}
      >
        {/* Logo + close button */}
        <div className="flex items-center justify-between px-5 pt-10 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)' }}>
              <Compass size={18} color="white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm" style={{ color: '#FDF6EC' }}>
                CulturaTour
              </p>
              <p className="text-xs" style={{ color: 'rgba(253,246,236,0.4)' }}>
                Provider Portal
              </p>
            </div>
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(253,246,236,0.08)' }}
          >
            <X size={16} color="white" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { onSelect(item.key); onClose(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: activeSection === item.key
                  ? 'rgba(200,101,27,0.18)' : 'transparent',
                color: activeSection === item.key
                  ? '#F4845F' : 'rgba(253,246,236,0.55)',
                borderLeft: activeSection === item.key
                  ? '3px solid #C8651B' : '3px solid transparent',
              }}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="px-3 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ color: 'rgba(252,165,165,0.7)' }}
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProviderSideNav;