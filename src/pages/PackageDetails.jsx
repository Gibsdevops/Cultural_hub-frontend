import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Share2, CheckCircle, XCircle,
  Clock, Users, Calendar, MapPin, ChevronRight,
  Loader2, Star, TrendingUp, Shield,
} from 'lucide-react';
import { getPackageById } from '../services/packageService';
import { useAuth } from '../context/AuthContext';

/**
 * PackageDetails — Full detail page for a tourism package
 *
 * Route: /packages/:packageId
 *
 * Features:
 *   - Image gallery with dot indicators
 *   - Provider info with verified badge
 *   - Full description (expandable)
 *   - What's included / excluded
 *   - Day schedule timeline
 *   - Sticky bottom booking bar with price
 *   - Redirects to booking page
 */
const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // ── State ────────────────────────────────────────────────────────────────
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

  // ── Fetch package ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const data = await getPackageById(packageId || 1);
        setPkg(data);
      } catch (err) {
        setError('Could not load package details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  // ── Handle Book button ───────────────────────────────────────────────────
  const handleBook = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${pkg.id}`);
  };

  // ── Format date ──────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric',
      month: 'long', day: 'numeric',
    });
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

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
           style={{ background: '#0D0D0D' }}>
        <p className="font-display text-xl text-center mb-6" style={{ color: '#FDF6EC' }}>
          {error || 'Package not found'}
        </p>
        <button onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-full font-semibold"
                style={{ background: '#C8651B', color: 'white' }}>
          Go Back
        </button>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-32" style={{ background: '#0D0D0D' }}>

      {/* ── Image Gallery ── */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {/* Images */}
        {pkg.media.map((m, i) => (
          <img
            key={m.id}
            src={m.media_url}
            alt={pkg.package_name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: activeImage === i ? 1 : 0 }}
          />
        ))}

        {/* Dark overlays */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(13,13,13,0.8) 100%)' }} />

        {/* Back + Share */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-4 pt-12 z-10">
          <button onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
            <Share2 size={18} color="white" />
          </button>
        </div>

        {/* Image dot indicators */}
        {pkg.media.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {pkg.media.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeImage === i ? '20px' : '6px',
                  height: '6px',
                  background: activeImage === i ? '#C8651B' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        )}

        {/* Difficulty badge */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{
                  background: pkg.difficulty === 'Easy'
                    ? 'rgba(45,106,79,0.85)'
                    : pkg.difficulty === 'Moderate'
                    ? 'rgba(200,101,27,0.85)'
                    : 'rgba(220,38,38,0.85)',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                }}>
            {pkg.difficulty}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 pt-5">

        {/* Provider row */}
        <button
          onClick={() => navigate(`/site/${pkg.provider.id}`)}
          className="flex items-center gap-2 mb-4 group"
        >
          <img src={pkg.provider.logo_url}
               alt={pkg.provider.site_name}
               className="w-8 h-8 rounded-full object-cover border"
               style={{ borderColor: 'rgba(200,101,27,0.5)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium" style={{ color: 'rgba(253,246,236,0.7)' }}>
              {pkg.provider.site_name}
            </span>
            {pkg.provider.verification_status === 'verified' && (
              <CheckCircle size={13} style={{ color: '#2D6A4F' }} fill="#2D6A4F" />
            )}
          </div>
          <ChevronRight size={14} style={{ color: 'rgba(253,246,236,0.3)' }} />
        </button>

        {/* Package title */}
        <h1 className="font-display font-bold mb-3"
            style={{ color: '#FDF6EC', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
          {pkg.package_name}
        </h1>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatChip icon={<Clock size={14} />}     label="Duration"     value={pkg.duration} />
          <StatChip icon={<Users size={14} />}     label="Max Group"    value={`${pkg.max_participants} people`} />
          <StatChip icon={<Calendar size={14} />}  label="Date"         value={formatDate(pkg.event_date)} />
          <StatChip icon={<TrendingUp size={14} />} label="Booked"      value={`${pkg.bookings_count} times`} />
        </div>

        {/* Description */}
        <Section title="About this Experience">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,246,236,0.65)' }}>
            {descExpanded || pkg.description.length <= 180
              ? pkg.description
              : pkg.description.slice(0, 180) + '...'}
            {pkg.description.length > 180 && (
              <button
                onClick={() => setDescExpanded(p => !p)}
                className="font-semibold ml-1"
                style={{ color: '#F4845F' }}
              >
                {descExpanded ? ' Show less' : ' Read more'}
              </button>
            )}
          </p>
        </Section>

        {/* What's Included */}
        <Section title="What's Included">
          <div className="flex flex-col gap-2">
            {pkg.includes.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle size={15} className="mt-0.5 flex-shrink-0"
                             style={{ color: '#2D6A4F' }} />
                <span className="text-sm" style={{ color: 'rgba(253,246,236,0.7)' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* What's Excluded */}
        <Section title="Not Included">
          <div className="flex flex-col gap-2">
            {pkg.excludes.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <XCircle size={15} className="mt-0.5 flex-shrink-0"
                         style={{ color: 'rgba(239,68,68,0.7)' }} />
                <span className="text-sm" style={{ color: 'rgba(253,246,236,0.5)' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Schedule / Timeline */}
        <Section title="Day Schedule">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3.5 top-0 bottom-0 w-px"
                 style={{ background: 'rgba(200,101,27,0.25)' }} />
            <div className="flex flex-col gap-0">
              {pkg.schedule.map((item, i) => (
                <div key={i} className="flex gap-4 pb-5 relative">
                  {/* Dot */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5"
                       style={{
                         background: i === 0 ? '#C8651B' : 'rgba(200,101,27,0.2)',
                         border: '2px solid #C8651B',
                       }}>
                    <div className="w-2 h-2 rounded-full"
                         style={{ background: i === 0 ? 'white' : '#C8651B' }} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <span className="text-xs font-bold block mb-0.5"
                          style={{ color: '#F4845F' }}>
                      {item.time}
                    </span>
                    <span className="text-sm" style={{ color: 'rgba(253,246,236,0.7)' }}>
                      {item.activity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Trust badges */}
        <div className="flex gap-3 mt-2 mb-4">
          {[
            { icon: <Shield size={14} />, text: 'Secure Booking' },
            { icon: <Star size={14} />,   text: 'Verified Provider' },
            { icon: <CheckCircle size={14} />, text: 'Free Cancellation' },
          ].map(({ icon, text }) => (
            <div key={text}
                 className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-1 justify-center"
                 style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(253,246,236,0.08)' }}>
              <span style={{ color: '#40916C' }}>{icon}</span>
              <span className="text-xs font-medium text-center leading-tight"
                    style={{ color: 'rgba(253,246,236,0.55)' }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky Bottom Booking Bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-5 py-4"
        style={{
          background: 'rgba(13,13,13,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(253,246,236,0.08)',
        }}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-2xl"
                    style={{ color: '#F4845F' }}>
                ${pkg.price}
              </span>
              <span className="text-sm" style={{ color: 'rgba(253,246,236,0.45)' }}>
                / person
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(253,246,236,0.35)' }}>
              {formatDate(pkg.event_date)}
            </p>
          </div>

          {/* Book Now button */}
          <button
            onClick={handleBook}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #C8651B, #F4845F)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(200,101,27,0.5)',
            }}
          >
            Book Now
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-display font-bold text-base mb-3" style={{ color: '#FDF6EC' }}>
      {title}
    </h3>
    {children}
    <div className="mt-5 h-px" style={{ background: 'rgba(253,246,236,0.06)' }} />
  </div>
);

const StatChip = ({ icon, label, value }) => (
  <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl"
       style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(253,246,236,0.08)' }}>
    <span style={{ color: '#C8651B' }}>{icon}</span>
    <div>
      <p className="text-xs" style={{ color: 'rgba(253,246,236,0.35)' }}>{label}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: '#FDF6EC' }}>{value}</p>
    </div>
  </div>
);

export default PackageDetails;