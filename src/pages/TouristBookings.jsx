import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, MapPin,
  CheckCircle, XCircle, AlertCircle,
  ChevronRight, Loader2, Package,
} from 'lucide-react';
import { getUserBookings } from '../services/bookingService';
import BottomNavBar from '../components/Navbar/BottomNavBar';

/**
 * TouristBookings — All bookings for the logged-in tourist
 *
 * Route: /bookings
 *
 * Features:
 *   - Tab switcher: Upcoming | Past
 *   - Booking cards with status badges
 *   - Tap to view full booking details
 *   - Booking detail bottom sheet
 *   - Empty states for both tabs
 */
const TouristBookings = () => {
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────────────────────
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ── Fetch bookings ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error('Bookings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ── Split into upcoming vs past ──────────────────────────────────────────
  const today = new Date();
  const upcoming = bookings.filter(b => new Date(b.package.event_date) >= today);
  const past     = bookings.filter(b => new Date(b.package.event_date) <  today);

  const displayList = activeTab === 'upcoming' ? upcoming : past;

  // ── Format date ──────────────────────────────────────────────────────────
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0D0D0D' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#C8651B' }} />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24" style={{ background: '#0D0D0D' }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(253,246,236,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#FDF6EC' }} />
        </button>
        <h1 className="font-display font-bold text-xl" style={{ color: '#FDF6EC' }}>
          My Bookings
        </h1>
        {/* Total bookings badge */}
        <div className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
             style={{ background: 'rgba(200,101,27,0.2)', color: '#F4845F' }}>
          {bookings.length} total
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="px-5 mb-5">
        <div className="flex rounded-2xl p-1"
             style={{ background: 'rgba(253,246,236,0.07)' }}>
          {[
            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { key: 'past',     label: `Past (${past.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: activeTab === tab.key
                  ? 'linear-gradient(135deg, #C8651B, #F4845F)'
                  : 'transparent',
                color: activeTab === tab.key ? 'white' : 'rgba(253,246,236,0.45)',
                boxShadow: activeTab === tab.key ? '0 4px 15px rgba(200,101,27,0.3)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bookings List ── */}
      <div className="px-5 flex flex-col gap-4">
        {displayList.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                 style={{ background: 'rgba(253,246,236,0.05)' }}>
              <Package size={28} style={{ color: 'rgba(253,246,236,0.2)' }} />
            </div>
            <p className="font-display text-lg font-bold" style={{ color: 'rgba(253,246,236,0.3)' }}>
              {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </p>
            <p className="text-sm text-center max-w-xs" style={{ color: 'rgba(253,246,236,0.25)' }}>
              {activeTab === 'upcoming'
                ? 'Explore cultural experiences and book your next adventure'
                : 'Your completed experiences will appear here'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => navigate('/feed')}
                className="mt-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)', color: 'white' }}
              >
                Explore Experiences
              </button>
            )}
          </div>
        ) : (
          displayList.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onClick={() => setSelectedBooking(booking)}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNavBar />

      {/* ── Booking Detail Bottom Sheet ── */}
      {selectedBooking && (
        <BookingDetailSheet
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          navigate={navigate}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// ─── BookingCard ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onClick, formatDate }) => {
  const statusConfig = {
    confirmed:  { color: '#40916C', bg: 'rgba(45,106,79,0.2)',  icon: <CheckCircle size={13} />,  label: 'Confirmed' },
    completed:  { color: '#C8651B', bg: 'rgba(200,101,27,0.2)', icon: <CheckCircle size={13} />,  label: 'Completed' },
    cancelled:  { color: '#EF4444', bg: 'rgba(239,68,68,0.2)',  icon: <XCircle size={13} />,      label: 'Cancelled' },
    pending:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.2)', icon: <AlertCircle size={13} />,  label: 'Pending' },
  };
  const status = statusConfig[booking.booking_status] || statusConfig.pending;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl overflow-hidden text-left transition-transform active:scale-98"
      style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)' }}
    >
      {/* Package image */}
      <div className="relative h-36">
        <img src={booking.package.media_url}
             alt={booking.package.package_name}
             className="w-full h-full object-cover" />
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />

        {/* Status badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
             style={{ background: status.bg, color: status.color }}>
          {status.icon}
          <span className="text-xs font-bold">{status.label}</span>
        </div>

        {/* Booking ref */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            #{booking.booking_ref}
          </span>
        </div>
      </div>

      {/* Booking details */}
      <div className="p-4">
        {/* Provider + package name */}
        <div className="flex items-start gap-3 mb-3">
          <img src={booking.provider.logo_url}
               alt={booking.provider.site_name}
               className="w-9 h-9 rounded-xl object-cover flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-display font-bold text-sm" style={{ color: '#FDF6EC' }}>
              {booking.package.package_name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(253,246,236,0.5)' }}>
              {booking.provider.site_name}
            </p>
          </div>
          <ChevronRight size={16} style={{ color: 'rgba(253,246,236,0.3)' }} />
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-3">
          <InfoChip icon={<Calendar size={11} />} text={formatDate(booking.package.event_date)} />
          <InfoChip icon={<Clock size={11} />}    text={booking.package.duration} />
          <InfoChip icon={<MapPin size={11} />}   text={booking.provider.location} />
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-3 pt-3"
             style={{ borderTop: '1px solid rgba(253,246,236,0.07)' }}>
          <span className="text-xs" style={{ color: 'rgba(253,246,236,0.4)' }}>
            {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
          </span>
          <span className="font-display font-bold text-base" style={{ color: '#F4845F' }}>
            ${booking.total_price}
          </span>
        </div>
      </div>
    </button>
  );
};

// ─── BookingDetailSheet ───────────────────────────────────────────────────────
const BookingDetailSheet = ({ booking, onClose, navigate, formatDate }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center"
       style={{ background: 'rgba(0,0,0,0.75)' }}
       onClick={onClose}>
    <div className="w-full max-w-lg rounded-t-3xl pb-10 overflow-y-auto"
         style={{ background: '#1A1040', maxHeight: '85vh' }}
         onClick={e => e.stopPropagation()}>

      {/* Handle + header */}
      <div className="sticky top-0 px-5 pt-5 pb-4"
           style={{ background: '#1A1040', borderBottom: '1px solid rgba(253,246,236,0.08)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4"
             style={{ background: 'rgba(253,246,236,0.2)' }} />
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg" style={{ color: '#FDF6EC' }}>
            Booking Details
          </h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(200,101,27,0.2)', color: '#F4845F' }}>
            #{booking.booking_ref}
          </span>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-4">

        {/* Package image + name */}
        <div className="rounded-2xl overflow-hidden">
          <div className="relative h-32">
            <img src={booking.package.media_url} alt=""
                 className="w-full h-full object-cover" />
            <div className="absolute inset-0"
                 style={{ background: 'rgba(0,0,0,0.4)' }} />
          </div>
          <div className="p-4" style={{ background: 'rgba(253,246,236,0.05)' }}>
            <p className="font-display font-bold text-base" style={{ color: '#FDF6EC' }}>
              {booking.package.package_name}
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(253,246,236,0.5)' }}>
              {booking.provider.site_name}
            </p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Event Date',      value: formatDate(booking.package.event_date) },
            { label: 'Duration',        value: booking.package.duration },
            { label: 'Participants',    value: `${booking.participants} ${booking.participants === 1 ? 'person' : 'people'}` },
            { label: 'Payment Method',  value: booking.payment_method === 'card' ? '💳 Card' : booking.payment_method === 'mobile' ? '📱 Mobile' : '💵 Cash' },
            { label: 'Booked On',       value: formatDate(booking.booking_date) },
            { label: 'Payment Status',  value: booking.payment_status === 'paid' ? '✅ Paid' : '⏳ Pending' },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl"
                 style={{ background: 'rgba(253,246,236,0.05)' }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(253,246,236,0.35)' }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: '#FDF6EC' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between px-4 py-4 rounded-2xl"
             style={{ background: 'rgba(200,101,27,0.1)', border: '1px solid rgba(200,101,27,0.3)' }}>
          <span className="font-semibold text-sm" style={{ color: 'rgba(253,246,236,0.7)' }}>
            Total Paid
          </span>
          <span className="font-display font-bold text-xl" style={{ color: '#F4845F' }}>
            ${booking.total_price}
          </span>
        </div>

        {/* Actions */}
        <button
          onClick={() => { onClose(); navigate(`/site/${booking.provider.id}`); }}
          className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)', color: 'white' }}
        >
          View Cultural Site
          <ChevronRight size={16} />
        </button>
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-semibold mb-2"
          style={{ background: 'rgba(253,246,236,0.06)', color: 'rgba(253,246,236,0.6)', border: '1px solid rgba(253,246,236,0.1)' }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const InfoChip = ({ icon, text }) => (
  <div className="flex items-center gap-1">
    <span style={{ color: '#F4845F' }}>{icon}</span>
    <span className="text-xs" style={{ color: 'rgba(253,246,236,0.5)' }}>{text}</span>
  </div>
);

export default TouristBookings;