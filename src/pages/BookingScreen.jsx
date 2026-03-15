
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, CreditCard,
  Smartphone, Banknote, ChevronRight,
  Loader2, Users, Calendar, Clock, Shield,
} from 'lucide-react';
import { getPackageById } from '../services/packageService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

/**
 * BookingScreen — Confirm booking & payment
 *
 * Route: /booking/:packageId
 *
 * Features:
 *   - Package summary card
 *   - Participant count selector
 *   - Payment method selection
 *   - Total price calculation
 *   - Booking confirmation with success screen
 */
const BookingScreen = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── State ────────────────────────────────────────────────────────────────
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // ── Booking form state ───────────────────────────────────────────────────
  const [participants, setParticipants] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // ── Fetch package ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const data = await getPackageById(packageId || 1);
        setPkg(data);
      } catch (err) {
        setError('Could not load package.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  // ── Calculate totals ─────────────────────────────────────────────────────
  const subtotal    = pkg ? pkg.price * participants : 0;
  const platformFee = Math.round(subtotal * 0.05); // 5% platform fee
  const total       = subtotal + platformFee;

  // ── Format date ──────────────────────────────────────────────────────────
  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  // ── Handle booking confirm ───────────────────────────────────────────────
  const handleConfirmBooking = async () => {
    setBookingError('');

    if (paymentMethod === 'card' && !cardNumber.trim()) {
      return setBookingError('Please enter your card number.');
    }
    if (paymentMethod === 'mobile' && !mobileNumber.trim()) {
      return setBookingError('Please enter your mobile money number.');
    }

    try {
      setBookingLoading(true);

      const bookingData = {
        tourist_id: user?.id,
        package_id: pkg.id,
        participants,
        payment_method: paymentMethod,
        total_price: total,
        booking_date: new Date().toISOString(),
      };

      const result = await createBooking(bookingData);

      // Generate reference number
      setBookingRef(`CT-${result.id || Math.floor(Math.random() * 90000 + 10000)}`);
      setConfirmed(true);

    } catch (err) {
      setBookingError(err.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0D0D0D' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#C8651B' }} />
      </div>
    );
  }

  // ── Booking Confirmed Screen ─────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
           style={{ background: 'linear-gradient(160deg, #0D1F16 0%, #0D0D0D 100%)' }}>

        {/* Success icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
             style={{ background: 'rgba(45,106,79,0.2)', border: '2px solid #2D6A4F' }}>
          <CheckCircle size={48} style={{ color: '#40916C' }} />
        </div>

        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: '#FDF6EC' }}>
          Booking Confirmed!
        </h1>
        <p className="text-sm mb-1" style={{ color: 'rgba(253,246,236,0.55)' }}>
          Your booking reference
        </p>
        <div className="px-6 py-3 rounded-2xl mb-6"
             style={{ background: 'rgba(200,101,27,0.15)', border: '1px solid rgba(200,101,27,0.4)' }}>
          <span className="font-display font-bold text-xl" style={{ color: '#F4845F' }}>
            {bookingRef}
          </span>
        </div>

        {/* Booking summary */}
        <div className="w-full max-w-sm rounded-2xl p-4 mb-8 text-left"
             style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(253,246,236,0.08)' }}>
          <p className="font-semibold text-sm mb-1" style={{ color: '#FDF6EC' }}>
            {pkg.package_name}
          </p>
          <p className="text-xs mb-3" style={{ color: 'rgba(253,246,236,0.45)' }}>
            {pkg.provider.site_name}
          </p>
          <div className="flex justify-between text-xs" style={{ color: 'rgba(253,246,236,0.55)' }}>
            <span>📅 {formatDate(pkg.event_date)}</span>
            <span>👥 {participants} {participants === 1 ? 'person' : 'people'}</span>
          </div>
          <div className="flex justify-between mt-3 pt-3"
               style={{ borderTop: '1px solid rgba(253,246,236,0.08)' }}>
            <span className="text-sm font-semibold" style={{ color: 'rgba(253,246,236,0.6)' }}>
              Total Paid
            </span>
            <span className="font-display font-bold" style={{ color: '#F4845F' }}>
              ${total}
            </span>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => navigate('/bookings')}
          className="w-full max-w-sm py-4 rounded-2xl font-bold mb-3"
          style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)', color: 'white' }}
        >
          View My Bookings
        </button>
        <button
          onClick={() => navigate('/feed')}
          className="w-full max-w-sm py-4 rounded-2xl font-semibold"
          style={{ background: 'rgba(253,246,236,0.06)', color: 'rgba(253,246,236,0.6)', border: '1px solid rgba(253,246,236,0.1)' }}
        >
          Explore More Experiences
        </button>
      </div>
    );
  }

  // ── Main Booking Form ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-36" style={{ background: '#0D0D0D' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(253,246,236,0.08)' }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <h1 className="font-display font-bold text-xl" style={{ color: '#FDF6EC' }}>
          Confirm Booking
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-5">

        {/* ── Package Summary Card ── */}
        <div className="rounded-2xl overflow-hidden"
             style={{ border: '1px solid rgba(253,246,236,0.08)' }}>
          <div className="relative h-36">
            <img src={pkg.media[0]?.media_url} alt={pkg.package_name}
                 className="w-full h-full object-cover" />
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="font-display font-bold text-base" style={{ color: '#FDF6EC' }}>
                {pkg.package_name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(253,246,236,0.6)' }}>
                {pkg.provider.site_name}
              </p>
            </div>
          </div>
          <div className="p-4 flex gap-4"
               style={{ background: 'rgba(253,246,236,0.04)' }}>
            <MiniStat icon={<Calendar size={13} />} text={formatDate(pkg.event_date)} />
            <MiniStat icon={<Clock size={13} />}    text={pkg.duration} />
            <MiniStat icon={<Users size={13} />}    text={`Max ${pkg.max_participants}`} />
          </div>
        </div>

        {/* ── Participants ── */}
        <div className="rounded-2xl p-4"
             style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)' }}>
          <p className="font-semibold text-sm mb-4" style={{ color: '#FDF6EC' }}>
            Number of Participants
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs" style={{ color: 'rgba(253,246,236,0.45)' }}>
                ${pkg.price} × {participants} {participants === 1 ? 'person' : 'people'}
              </p>
            </div>
            {/* Counter */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setParticipants(p => Math.max(1, p - 1))}
                disabled={participants <= 1}
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg"
                style={{
                  background: participants <= 1 ? 'rgba(253,246,236,0.05)' : 'rgba(200,101,27,0.2)',
                  color: participants <= 1 ? 'rgba(253,246,236,0.2)' : '#C8651B',
                  border: '1px solid currentColor',
                }}
              >
                −
              </button>
              <span className="font-display font-bold text-2xl w-6 text-center"
                    style={{ color: '#FDF6EC' }}>
                {participants}
              </span>
              <button
                onClick={() => setParticipants(p => Math.min(pkg.max_participants, p + 1))}
                disabled={participants >= pkg.max_participants}
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg"
                style={{
                  background: participants >= pkg.max_participants ? 'rgba(253,246,236,0.05)' : 'rgba(200,101,27,0.2)',
                  color: participants >= pkg.max_participants ? 'rgba(253,246,236,0.2)' : '#C8651B',
                  border: '1px solid currentColor',
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ── Payment Method ── */}
        <div className="rounded-2xl p-4"
             style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)' }}>
          <p className="font-semibold text-sm mb-4" style={{ color: '#FDF6EC' }}>
            Payment Method
          </p>
          <div className="flex flex-col gap-3">
            {[
              { id: 'card',   icon: <CreditCard size={18} />,   label: 'Credit / Debit Card' },
              { id: 'mobile', icon: <Smartphone size={18} />,   label: 'Mobile Money' },
              { id: 'cash',   icon: <Banknote size={18} />,     label: 'Pay on Arrival' },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left"
                style={{
                  background: paymentMethod === method.id
                    ? 'rgba(200,101,27,0.15)' : 'rgba(253,246,236,0.03)',
                  border: paymentMethod === method.id
                    ? '1.5px solid #C8651B' : '1.5px solid rgba(253,246,236,0.08)',
                }}
              >
                <span style={{ color: paymentMethod === method.id ? '#C8651B' : 'rgba(253,246,236,0.4)' }}>
                  {method.icon}
                </span>
                <span className="text-sm font-medium" style={{ color: '#FDF6EC' }}>
                  {method.label}
                </span>
                {paymentMethod === method.id && (
                  <CheckCircle size={16} className="ml-auto" style={{ color: '#C8651B' }} />
                )}
              </button>
            ))}
          </div>

          {/* Card fields */}
          {paymentMethod === 'card' && (
            <div className="mt-4 flex flex-col gap-3">
              <PayInput
                placeholder="Card number (e.g. 4242 4242 4242 4242)"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                icon={<CreditCard size={15} />}
              />
              <PayInput
                placeholder="Name on card"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                icon={<Users size={15} />}
              />
              <div className="grid grid-cols-2 gap-3">
                <PayInput placeholder="MM / YY" icon={<Calendar size={15} />} />
                <PayInput placeholder="CVV" icon={<Shield size={15} />} />
              </div>
            </div>
          )}

          {/* Mobile Money field */}
          {paymentMethod === 'mobile' && (
            <div className="mt-4">
              <PayInput
                placeholder="Mobile money number"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value)}
                icon={<Smartphone size={15} />}
              />
              <p className="text-xs mt-2" style={{ color: 'rgba(253,246,236,0.35)' }}>
                You will receive a payment prompt on your phone.
              </p>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="mt-4 px-4 py-3 rounded-xl"
                 style={{ background: 'rgba(45,106,79,0.1)', border: '1px solid rgba(45,106,79,0.3)' }}>
              <p className="text-xs" style={{ color: '#40916C' }}>
                💡 Please arrive 15 minutes early. Bring exact cash in USD.
              </p>
            </div>
          )}
        </div>

        {/* ── Price Breakdown ── */}
        <div className="rounded-2xl p-4"
             style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)' }}>
          <p className="font-semibold text-sm mb-4" style={{ color: '#FDF6EC' }}>
            Price Breakdown
          </p>
          <div className="flex flex-col gap-2.5">
            <PriceLine label={`${pkg.package_name} × ${participants}`} value={`$${subtotal}`} />
            <PriceLine label="Platform fee (5%)" value={`$${platformFee}`} muted />
            <div className="h-px mt-1" style={{ background: 'rgba(253,246,236,0.08)' }} />
            <PriceLine label="Total" value={`$${total}`} bold />
          </div>
        </div>

        {/* Error */}
        {bookingError && (
          <div className="px-4 py-3 rounded-xl text-sm"
               style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
            ⚠️ {bookingError}
          </div>
        )}
      </div>

      {/* ── Sticky Confirm Button ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-5 py-4"
           style={{ background: 'rgba(13,13,13,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(253,246,236,0.08)' }}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleConfirmBooking}
            disabled={bookingLoading}
            className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #C8651B, #F4845F)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(200,101,27,0.45)',
              opacity: bookingLoading ? 0.8 : 1,
            }}
          >
            {bookingLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm & Pay ${total}
                <ChevronRight size={18} />
              </>
            )}
          </button>
          <p className="text-center text-xs mt-2" style={{ color: 'rgba(253,246,236,0.3)' }}>
            🔒 Secured by CulturaTour — 256-bit SSL
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const MiniStat = ({ icon, text }) => (
  <div className="flex items-center gap-1.5">
    <span style={{ color: '#F4845F' }}>{icon}</span>
    <span className="text-xs" style={{ color: 'rgba(253,246,236,0.55)' }}>{text}</span>
  </div>
);

const PayInput = ({ placeholder, value, onChange, icon }) => (
  <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl"
       style={{ background: 'rgba(253,246,236,0.06)', border: '1px solid rgba(253,246,236,0.1)' }}>
    <span style={{ color: 'rgba(253,246,236,0.3)' }}>{icon}</span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="flex-1 bg-transparent text-sm outline-none"
      style={{ color: '#FDF6EC' }}
    />
    <style>{`input::placeholder { color: rgba(253,246,236,0.25); }`}</style>
  </div>
);

const PriceLine = ({ label, value, muted, bold }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm" style={{ color: muted ? 'rgba(253,246,236,0.35)' : 'rgba(253,246,236,0.6)' }}>
      {label}
    </span>
    <span className={bold ? 'font-display font-bold text-lg' : 'text-sm font-medium'}
          style={{ color: bold ? '#F4845F' : 'rgba(253,246,236,0.8)' }}>
      {value}
    </span>
  </div>
);

export default BookingScreen;