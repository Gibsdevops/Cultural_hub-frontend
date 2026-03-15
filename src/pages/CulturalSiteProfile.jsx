import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Mail, Phone, CheckCircle,
  Heart, Grid, Package, Share2, Loader2, Image, ExternalLink,
} from 'lucide-react';
import { getCulturalSite, followSite } from '../services/providerService';
import { useAuth } from '../context/AuthContext';

/**
 * CulturalSiteProfile — Full profile page for a cultural service provider
 *
 * Route: /site/:siteId
 *
 * Features:
 *   - Hero cover image + logo overlay
 *   - Verified badge
 *   - Follow / Unfollow with count
 *   - Stats: posts, packages, followers
 *   - Tab switcher: Experiences | Packages
 *   - Masonry grid of experience posts
 *   - Package cards with price + CTA
 *   - Contact info section
 */
const CulturalSiteProfile = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // ── State ────────────────────────────────────────────────────────────────
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('experiences');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // ── Fetch site data ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        const data = await getCulturalSite(siteId || 101);
        setSite(data);
        setFollowCount(data.followers_count);
      } catch (err) {
        setError('Could not load this cultural site.');
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [siteId]);

  // ── Handle Follow ────────────────────────────────────────────────────────
  const handleFollow = async () => {
    if (!isLoggedIn) { setShowLoginPrompt(true); return; }
    try {
      setFollowLoading(true);
      await followSite(siteId);
      setIsFollowing(prev => !prev);
      setFollowCount(prev => isFollowing ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  // ── Format numbers ───────────────────────────────────────────────────────
  const formatNum = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0D0D0D' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={36} className="animate-spin" style={{ color: '#C8651B' }} />
          <p className="text-sm" style={{ color: 'rgba(253,246,236,0.5)' }}>
            Loading cultural site...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
           style={{ background: '#0D0D0D' }}>
        <p className="font-display text-xl text-center mb-6" style={{ color: '#FDF6EC' }}>
          {error || 'Site not found'}
        </p>
        <button onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-full font-semibold"
                style={{ background: '#C8651B', color: 'white' }}>
          Go Back
        </button>
      </div>
    );
  }

  const activePackages = site.packages.filter(p => p.status === 'active');
  const pastPackages   = site.packages.filter(p => p.status === 'past');

  // ── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#0D0D0D' }}>

      {/* ── Hero Section ── */}
      <div className="relative">

        {/* Cover Image */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={site.cover_url}
            alt={site.site_name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
               style={{
                 background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(13,13,13,0.6) 100%)'
               }} />
        </div>

        {/* Back + Share buttons over cover */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          >
            <Share2 size={18} color="white" />
          </button>
        </div>

        {/* Logo — overlapping cover and content */}
        <div className="absolute -bottom-12 left-5">
          <div className="relative">
            <img
              src={site.logo_url}
              alt={site.site_name}
              className="w-24 h-24 rounded-2xl object-cover border-4"
              style={{ borderColor: '#0D0D0D' }}
            />
            {/* Verified badge */}
            {site.verification_status === 'verified' && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                   style={{ background: '#0D0D0D' }}>
                <CheckCircle size={22} style={{ color: '#2D6A4F' }} fill="#2D6A4F" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Profile Info ── */}
      <div className="px-5 pt-16 pb-4">

        {/* Name + Follow row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-xl leading-tight"
                  style={{ color: '#FDF6EC' }}>
                {site.site_name}
              </h1>
              {site.verification_status === 'verified' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(45,106,79,0.2)', color: '#40916C', border: '1px solid rgba(45,106,79,0.4)' }}>
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} style={{ color: '#F4845F' }} />
              <p className="text-xs" style={{ color: 'rgba(253,246,236,0.55)' }}>
                {site.location}
              </p>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
            style={{
              background: isFollowing
                ? 'rgba(253,246,236,0.08)'
                : 'linear-gradient(135deg, #C8651B, #F4845F)',
              color: isFollowing ? 'rgba(253,246,236,0.7)' : 'white',
              border: isFollowing ? '1px solid rgba(253,246,236,0.15)' : 'none',
              boxShadow: isFollowing ? 'none' : '0 4px 15px rgba(200,101,27,0.35)',
              minWidth: '90px',
            }}
          >
            {followLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Heart
                  size={14}
                  fill={isFollowing ? 'currentColor' : 'none'}
                />
                {isFollowing ? 'Following' : 'Follow'}
              </>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 mb-5 mt-4">
          {[
            { label: 'Posts',     value: site.posts_count },
            { label: 'Packages',  value: site.packages_count },
            { label: 'Followers', value: formatNum(followCount) },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-display font-bold text-lg" style={{ color: '#FDF6EC' }}>
                {value}
              </span>
              <span className="text-xs" style={{ color: 'rgba(253,246,236,0.45)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* About */}
        <AboutText text={site.description} />

        {/* Contact Info */}
        <div className="flex flex-col gap-2 mt-4">
          {site.contact_email && (
            <ContactRow icon={<Mail size={13} />} text={site.contact_email} />
          )}
          {site.contact_phone && (
            <ContactRow icon={<Phone size={13} />} text={site.contact_phone} />
          )}
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex border-b px-5 mt-2"
           style={{ borderColor: 'rgba(253,246,236,0.08)' }}>
        {[
          { key: 'experiences', label: 'Experiences', icon: <Grid size={15} /> },
          { key: 'packages',    label: 'Packages',    icon: <Package size={15} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold mr-2 border-b-2 transition-all"
            style={{
              borderColor: activeTab === tab.key ? '#C8651B' : 'transparent',
              color: activeTab === tab.key ? '#C8651B' : 'rgba(253,246,236,0.4)',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="pb-24">

        {/* ── EXPERIENCES GRID ── */}
        {activeTab === 'experiences' && (
          <div>
            {site.experiences.length === 0 ? (
              <EmptyState icon={<Image size={32} />} message="No experiences posted yet" />
            ) : (
              <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                {site.experiences.map((exp, index) => (
                  <ExperienceGridItem
                    key={exp.id}
                    experience={exp}
                    featured={index === 0} // first item is larger
                    onClick={() => navigate(`/experience/${exp.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PACKAGES ── */}
        {activeTab === 'packages' && (
          <div className="px-5 pt-5 flex flex-col gap-4">

            {/* Active packages */}
            {activePackages.length > 0 && (
              <div>
                <SectionLabel text="Available Now" color="#40916C" />
                <div className="flex flex-col gap-4 mt-3">
                  {activePackages.map(pkg => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      onClick={() => navigate(`/packages/${pkg.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past packages */}
            {pastPackages.length > 0 && (
              <div className="mt-2">
                <SectionLabel text="Past Experiences" color="rgba(253,246,236,0.35)" />
                <div className="flex flex-col gap-4 mt-3">
                  {pastPackages.map(pkg => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      past
                      onClick={() => navigate(`/packages/${pkg.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No packages */}
            {site.packages.length === 0 && (
              <EmptyState icon={<Package size={32} />} message="No packages available yet" />
            )}
          </div>
        )}
      </div>

      {/* ── Login Prompt (simple inline) ── */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
             style={{ background: 'rgba(0,0,0,0.7)' }}
             onClick={() => setShowLoginPrompt(false)}>
          <div className="w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
               style={{ background: '#1A1040' }}
               onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6"
                 style={{ background: 'rgba(253,246,236,0.2)' }} />
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#FDF6EC' }}>
              Log in to follow
            </h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(253,246,236,0.5)' }}>
              Follow cultural sites to get updates on new experiences and packages.
            </p>
            <button onClick={() => navigate('/login')}
                    className="w-full py-4 rounded-2xl font-semibold mb-3"
                    style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)', color: 'white' }}>
              Log In
            </button>
            <button onClick={() => setShowLoginPrompt(false)}
                    className="w-full py-4 rounded-2xl font-semibold"
                    style={{ background: 'rgba(253,246,236,0.06)', color: 'rgba(253,246,236,0.6)', border: '1px solid rgba(253,246,236,0.1)' }}>
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Expandable about text */
const AboutText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text?.length > 120;
  return (
    <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,246,236,0.65)' }}>
      {isLong && !expanded ? text.slice(0, 120) + '... ' : text}
      {isLong && (
        <button onClick={() => setExpanded(p => !p)}
                className="font-semibold ml-1"
                style={{ color: '#F4845F' }}>
          {expanded ? 'less' : 'more'}
        </button>
      )}
    </p>
  );
};

/** Contact info row */
const ContactRow = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    <span style={{ color: '#F4845F' }}>{icon}</span>
    <span className="text-xs" style={{ color: 'rgba(253,246,236,0.55)' }}>{text}</span>
  </div>
);

/** Experience grid item */
const ExperienceGridItem = ({ experience, featured, onClick }) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden bg-gray-900 ${featured ? 'col-span-2 row-span-2' : ''}`}
    style={{ aspectRatio: '1/1' }}
  >
    <img
      src={experience.media_url}
      alt=""
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    />
    {/* Like count overlay */}
    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
      <Heart size={11} fill="white" color="white" />
      <span className="text-xs font-semibold text-white"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        {experience.likes_count >= 1000
          ? (experience.likes_count / 1000).toFixed(1) + 'K'
          : experience.likes_count}
      </span>
    </div>
  </button>
);

/** Package card */
const PackageCard = ({ pkg, past, onClick }) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{
      background: 'rgba(253,246,236,0.04)',
      border: '1px solid rgba(253,246,236,0.08)',
      opacity: past ? 0.65 : 1,
    }}
  >
    {/* Package image */}
    <div className="relative h-40 overflow-hidden">
      <img src={pkg.media_url} alt={pkg.package_name}
           className="w-full h-full object-cover" />
      <div className="absolute inset-0"
           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
      {/* Duration badge */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
           style={{ background: 'rgba(0,0,0,0.5)', color: 'white', backdropFilter: 'blur(8px)' }}>
        ⏱ {pkg.duration}
      </div>
      {/* Past badge */}
      {past && (
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
             style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.6)' }}>
          Past Event
        </div>
      )}
    </div>

    {/* Package details */}
    <div className="p-4">
      <h3 className="font-display font-bold text-base mb-1" style={{ color: '#FDF6EC' }}>
        {pkg.package_name}
      </h3>
      <p className="text-xs mb-3 line-clamp-2" style={{ color: 'rgba(253,246,236,0.55)' }}>
        {pkg.description}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-display font-bold text-lg" style={{ color: '#F4845F' }}>
            ${pkg.price}
          </span>
          <span className="text-xs ml-1" style={{ color: 'rgba(253,246,236,0.4)' }}>
            per person
          </span>
        </div>
        {!past && (
          <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #C8651B, #F4845F)',
              color: 'white',
              boxShadow: '0 3px 12px rgba(200,101,27,0.35)',
            }}
          >
            View Details
            <ExternalLink size={13} />
          </button>
        )}
      </div>
    </div>
  </div>
);

/** Section label */
const SectionLabel = ({ text, color }) => (
  <p className="text-xs font-semibold uppercase tracking-widest"
     style={{ color }}>
    {text}
  </p>
);

/** Empty state */
const EmptyState = ({ icon, message }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div style={{ color: 'rgba(253,246,236,0.2)' }}>{icon}</div>
    <p className="text-sm" style={{ color: 'rgba(253,246,236,0.3)' }}>{message}</p>
  </div>
);

export default CulturalSiteProfile;