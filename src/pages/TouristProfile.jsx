import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, LogOut, ChevronRight, MapPin,
  Calendar, Bookmark, Heart,
  Edit3, Camera, Bell, HelpCircle,
  Shield, Star, Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/userService';
import BottomNavBar from '../components/Navbar/BottomNavBar';

/**
 * TouristProfile — Tourist's personal account page
 *
 * Route: /profile
 *
 * Features:
 *   - Profile photo + name + stats
 *   - Quick action tiles
 *   - Settings menu items
 *   - Logout with confirmation
 *   - Edit profile placeholder
 */
const TouristProfile = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  // ── State ────────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ── Fetch profile ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        // Fall back to auth context user data
        setProfile(user);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // ── Handle logout ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  // ── Format joined date ───────────────────────────────────────────────────
  const formatJoined = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', year: 'numeric',
    });
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0D0D0D' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#C8651B' }} />
      </div>
    );
  }

  const displayUser = profile || user;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24" style={{ background: '#0D0D0D' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="font-display font-bold text-xl" style={{ color: '#FDF6EC' }}>
          My Profile
        </h1>
        <button
          onClick={() => {}}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(253,246,236,0.08)' }}
        >
          <Settings size={17} style={{ color: 'rgba(253,246,236,0.7)' }} />
        </button>
      </div>

      {/* ── Profile Card ── */}
      <div className="mx-5 rounded-3xl p-5 mb-5"
           style={{
             background: 'linear-gradient(135deg, rgba(200,101,27,0.12) 0%, rgba(45,106,79,0.08) 100%)',
             border: '1px solid rgba(253,246,236,0.08)',
           }}>

        {/* Avatar + Edit button */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {displayUser?.profile_image ? (
              <img
                src={displayUser.profile_image}
                alt={displayUser.full_name}
                className="w-20 h-20 rounded-2xl object-cover border-2"
                style={{ borderColor: '#C8651B' }}
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2"
                   style={{ background: 'rgba(200,101,27,0.2)', borderColor: '#C8651B' }}>
                <span className="font-display font-bold text-2xl" style={{ color: '#C8651B' }}>
                  {displayUser?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            {/* Camera overlay */}
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: '#C8651B' }}>
              <Camera size={13} color="white" />
            </button>
          </div>

          {/* Edit Profile button */}
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: 'rgba(253,246,236,0.08)',
              color: 'rgba(253,246,236,0.7)',
              border: '1px solid rgba(253,246,236,0.12)',
            }}
          >
            <Edit3 size={13} />
            Edit
          </button>
        </div>

        {/* Name + info */}
        <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#FDF6EC' }}>
          {displayUser?.full_name || 'Tourist'}
        </h2>
        <p className="text-sm mb-1" style={{ color: 'rgba(253,246,236,0.5)' }}>
          {displayUser?.email}
        </p>

        {/* Location + joined */}
        <div className="flex items-center gap-4 mt-2">
          {displayUser?.location && (
            <div className="flex items-center gap-1">
              <MapPin size={11} style={{ color: '#F4845F' }} />
              <span className="text-xs" style={{ color: 'rgba(253,246,236,0.45)' }}>
                {displayUser.location}
              </span>
            </div>
          )}
          {displayUser?.joined_date && (
            <div className="flex items-center gap-1">
              <Calendar size={11} style={{ color: '#F4845F' }} />
              <span className="text-xs" style={{ color: 'rgba(253,246,236,0.45)' }}>
                Joined {formatJoined(displayUser.joined_date)}
              </span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex gap-0 mt-5 pt-4"
             style={{ borderTop: '1px solid rgba(253,246,236,0.08)' }}>
          {[
            { icon: <Calendar size={15} />, value: displayUser?.bookings_count || 0,  label: 'Bookings' },
            { icon: <Bookmark size={15} />, value: displayUser?.saved_count || 0,     label: 'Saved' },
            { icon: <Heart size={15} />,    value: displayUser?.following_count || 0, label: 'Following' },
          ].map(({ icon, value, label }, i) => (
            <div key={label}
                 className="flex-1 flex flex-col items-center gap-1 py-1"
                 style={{
                   borderRight: i < 2 ? '1px solid rgba(253,246,236,0.08)' : 'none',
                 }}>
              <div className="flex items-center gap-1.5">
                <span style={{ color: '#C8651B' }}>{icon}</span>
                <span className="font-display font-bold text-xl" style={{ color: '#FDF6EC' }}>
                  {value}
                </span>
              </div>
              <span className="text-xs" style={{ color: 'rgba(253,246,236,0.4)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="mx-5 grid grid-cols-2 gap-3 mb-5">
        <QuickAction
          icon={<Calendar size={20} />}
          label="My Bookings"
          sublabel="View all trips"
          color="#C8651B"
          onClick={() => navigate('/bookings')}
        />
        <QuickAction
          icon={<Bookmark size={20} />}
          label="Saved"
          sublabel="12 experiences"
          color="#2D6A4F"
          onClick={() => {}}
        />
        <QuickAction
          icon={<Bell size={20} />}
          label="Notifications"
          sublabel="3 unread"
          color="#F4845F"
          onClick={() => navigate('/notifications')}
        />
        <QuickAction
          icon={<Star size={20} />}
          label="Reviews"
          sublabel="Write a review"
          color="#7C3AED"
          onClick={() => {}}
        />
      </div>

      {/* ── Settings Menu ── */}
      <div className="mx-5 rounded-2xl overflow-hidden mb-4"
           style={{ border: '1px solid rgba(253,246,236,0.08)' }}>
        <MenuGroup title="Account">
          <MenuItem icon={<Edit3 size={16} />}   label="Edit Profile"        onClick={() => {}} />
          <MenuItem icon={<Shield size={16} />}  label="Privacy & Security"  onClick={() => {}} />
          <MenuItem icon={<Bell size={16} />}    label="Notification Settings" onClick={() => {}} />
        </MenuGroup>
      </div>

      <div className="mx-5 rounded-2xl overflow-hidden mb-4"
           style={{ border: '1px solid rgba(253,246,236,0.08)' }}>
        <MenuGroup title="Support">
          <MenuItem icon={<HelpCircle size={16} />} label="Help Center"     onClick={() => {}} />
          <MenuItem icon={<Star size={16} />}       label="Rate the App"    onClick={() => {}} />
        </MenuGroup>
      </div>

      {/* ── Logout Button ── */}
      <div className="mx-5 mb-6">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm"
          style={{
            background: 'rgba(239,68,68,0.1)',
            color: '#FCA5A5',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNavBar />

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
             style={{ background: 'rgba(0,0,0,0.7)' }}
             onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
               style={{ background: '#1A1040' }}
               onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6"
                 style={{ background: 'rgba(253,246,236,0.2)' }} />
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#FDF6EC' }}>
              Log out?
            </h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(253,246,236,0.5)' }}>
              You will need to log back in to access your bookings and saved experiences.
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl font-bold mb-3"
              style={{ background: 'rgba(239,68,68,0.85)', color: 'white' }}
            >
              Yes, Log Out
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full py-4 rounded-2xl font-semibold"
              style={{ background: 'rgba(253,246,236,0.06)', color: 'rgba(253,246,236,0.6)', border: '1px solid rgba(253,246,236,0.1)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const QuickAction = ({ icon, label, sublabel, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col gap-2 p-4 rounded-2xl text-left transition-transform active:scale-95"
    style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)' }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
         style={{ background: `${color}25`, color }}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold" style={{ color: '#FDF6EC' }}>{label}</p>
      <p className="text-xs mt-0.5" style={{ color: 'rgba(253,246,236,0.4)' }}>{sublabel}</p>
    </div>
  </button>
);

const MenuGroup = ({ title, children }) => (
  <div>
    <p className="px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-widest"
       style={{ color: 'rgba(253,246,236,0.3)' }}>
      {title}
    </p>
    {children}
  </div>
);

const MenuItem = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3.5 transition-all"
    style={{ borderTop: '1px solid rgba(253,246,236,0.05)' }}
  >
    <div className="flex items-center gap-3">
      <span style={{ color: danger ? '#FCA5A5' : 'rgba(253,246,236,0.4)' }}>{icon}</span>
      <span className="text-sm font-medium"
            style={{ color: danger ? '#FCA5A5' : 'rgba(253,246,236,0.8)' }}>
        {label}
      </span>
    </div>
    <ChevronRight size={15} style={{ color: 'rgba(253,246,236,0.2)' }} />
  </button>
);

export default TouristProfile;