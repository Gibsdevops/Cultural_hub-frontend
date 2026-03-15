import React, { useState, useEffect } from 'react';
import {
  Menu, Calendar, Package,
  Image, Plus, ChevronRight, Loader2,
  CheckCircle, Upload, Trash2, Edit3, X, Camera,
  DollarSign, Users, BarChart2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProviderSideNav from '../components/Provider/ProviderSideNav';
import {
  getDashboardStats,
  getProviderBookings,
  uploadExperience,
  createPackage,
  deletePackage,
} from '../services/providerDashboardService';

/**
 * ProviderDashboard — Full provider management interface
 *
 * Route: /provider/dashboard
 *
 * Sections:
 *   home     — stats overview + recent bookings
 *   upload   — upload experience post
 *   packages — manage packages (create, view, delete)
 *   bookings — view all bookings from tourists
 *   profile  — manage provider profile
 */
const ProviderDashboard = () => {
  useAuth();

  // ── State ────────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState('home');
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch dashboard data ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setDashData(data);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Section titles ───────────────────────────────────────────────────────
  const sectionTitles = {
    home:     'Dashboard',
    upload:   'Upload Experience',
    packages: 'Packages',
    bookings: 'Bookings',
    profile:  'Provider Profile',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0D0D0D' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#C8651B' }} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0A0618' }}>

      {/* ── Side Navigation ── */}
      <ProviderSideNav
        activeSection={activeSection}
        onSelect={setActiveSection}
        isOpen={sideNavOpen}
        onClose={() => setSideNavOpen(false)}
      />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-5 pt-10 pb-4 sticky top-0 z-30"
             style={{
               background: 'rgba(10,6,24,0.95)',
               backdropFilter: 'blur(20px)',
               borderBottom: '1px solid rgba(253,246,236,0.06)',
             }}>
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setSideNavOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl"
              style={{ background: 'rgba(253,246,236,0.08)' }}
            >
              <Menu size={18} color="white" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg" style={{ color: '#FDF6EC' }}>
                {sectionTitles[activeSection]}
              </h1>
              <p className="text-xs" style={{ color: 'rgba(253,246,236,0.4)' }}>
                {dashData?.provider?.site_name}
              </p>
            </div>
          </div>

          {/* Provider avatar */}
          <img
            src={dashData?.provider?.logo_url}
            alt="provider"
            className="w-9 h-9 rounded-xl object-cover border"
            style={{ borderColor: 'rgba(200,101,27,0.5)' }}
          />
        </div>

        {/* ── Section Content ── */}
        <div className="flex-1 overflow-y-auto pb-10">
          {activeSection === 'home'     && <DashboardHome     data={dashData} onNavigate={setActiveSection} />}
          {activeSection === 'upload'   && <UploadSection />}
          {activeSection === 'packages' && <PackagesSection   packages={dashData?.packages || []} />}
          {activeSection === 'bookings' && <BookingsSection   />}
          {activeSection === 'profile'  && <ProfileSection    provider={dashData?.provider} />}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Dashboard Home
// ═══════════════════════════════════════════════════════════════════════════════
const DashboardHome = ({ data, onNavigate }) => {
  if (!data) return null;
  const { stats } = data;

  return (
    <div className="px-5 pt-5 flex flex-col gap-6">

      {/* ── Welcome banner ── */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(200,101,27,0.3) 0%, rgba(45,106,79,0.2) 100%)',
             border: '1px solid rgba(200,101,27,0.3)',
           }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
           style={{ color: '#F4845F' }}>
          Welcome back
        </p>
        <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#FDF6EC' }}>
          {data.provider.site_name}
        </h2>
        <p className="text-sm" style={{ color: 'rgba(253,246,236,0.55)' }}>
          You have{' '}
          <span style={{ color: '#F4845F', fontWeight: 700 }}>
            {stats.this_month_bookings} bookings
          </span>
          {' '}this month
        </p>
        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full"
             style={{ background: 'rgba(200,101,27,0.1)' }} />
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Image size={20} />}
          label="Total Posts"
          value={stats.total_posts}
          color="#C8651B"
          sub="+3 this week"
        />
        <StatCard
          icon={<Package size={20} />}
          label="Packages"
          value={stats.total_packages}
          color="#2D6A4F"
          sub={`${stats.packages_active || 2} active`}
        />
        <StatCard
          icon={<Users size={20} />}
          label="Total Bookings"
          value={stats.total_bookings}
          color="#7C3AED"
          sub={`+${stats.this_month_bookings} this month`}
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Revenue"
          value={`$${(stats.total_revenue / 1000).toFixed(1)}K`}
          color="#F4845F"
          sub={`$${stats.this_month_revenue} this month`}
        />
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
           style={{ color: 'rgba(253,246,236,0.35)' }}>
          Quick Actions
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Upload size={18} />,      label: 'Upload',   key: 'upload',   color: '#C8651B' },
            { icon: <Plus size={18} />,        label: 'Package',  key: 'packages', color: '#2D6A4F' },
            { icon: <BarChart2 size={18} />,   label: 'Bookings', key: 'bookings', color: '#7C3AED' },
          ].map(a => (
            <button
              key={a.key}
              onClick={() => onNavigate(a.key)}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl"
              style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(253,246,236,0.08)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: `${a.color}22`, color: a.color }}>
                {a.icon}
              </div>
              <span className="text-xs font-semibold" style={{ color: 'rgba(253,246,236,0.7)' }}>
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Bookings ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest"
             style={{ color: 'rgba(253,246,236,0.35)' }}>
            Recent Bookings
          </p>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: '#F4845F' }}
          >
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {data.recent_bookings.slice(0, 3).map(booking => (
            <RecentBookingRow key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Upload Experience
// ═══════════════════════════════════════════════════════════════════════════════
const UploadSection = () => {
  const [form, setForm] = useState({ caption: '', location: '', media: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, media: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.caption.trim()) return setError('Please add a caption.');
    if (!form.location.trim()) return setError('Please add a location.');

    try {
      setLoading(true);
      await uploadExperience(form);
      setSuccess(true);
      setForm({ caption: '', location: '', media: null });
      setPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pt-5">
      <p className="text-sm mb-5" style={{ color: 'rgba(253,246,236,0.5)' }}>
        Share a photo or video from your cultural site to appear in the tourist discovery feed.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Media upload area */}
        <div className="relative">
          {preview ? (
            <div className="relative rounded-2xl overflow-hidden"
                 style={{ aspectRatio: '4/3' }}>
              <img src={preview} alt="Preview"
                   className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setPreview(null); setForm(p => ({ ...p, media: null })); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <X size={16} color="white" />
              </button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer transition-all"
              style={{
                aspectRatio: '4/3',
                background: 'rgba(253,246,236,0.04)',
                border: '2px dashed rgba(253,246,236,0.15)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                   style={{ background: 'rgba(200,101,27,0.15)' }}>
                <Camera size={24} style={{ color: '#C8651B' }} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm" style={{ color: '#FDF6EC' }}>
                  Tap to upload photo or video
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(253,246,236,0.35)' }}>
                  JPG, PNG, MP4 supported
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Caption */}
        <div className="rounded-2xl p-4"
             style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(253,246,236,0.1)' }}>
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider"
             style={{ color: 'rgba(253,246,236,0.35)' }}>Caption</p>
          <textarea
            placeholder="Describe this cultural experience..."
            value={form.caption}
            onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
            rows={3}
            className="w-full bg-transparent text-sm outline-none resize-none"
            style={{ color: '#FDF6EC' }}
          />
          <style>{`textarea::placeholder { color: rgba(253,246,236,0.25); }`}</style>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl"
             style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(253,246,236,0.1)' }}>
          <span style={{ color: 'rgba(253,246,236,0.3)', fontSize: '14px' }}>📍</span>
          <input
            type="text"
            placeholder="Add location (e.g. Kanungu, Uganda)"
            value={form.location}
            onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#FDF6EC' }}
          />
          <style>{`input::placeholder { color: rgba(253,246,236,0.25); }`}</style>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm"
               style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="px-4 py-3 rounded-xl text-sm flex items-center gap-2"
               style={{ background: 'rgba(45,106,79,0.2)', border: '1px solid rgba(45,106,79,0.4)', color: '#40916C' }}>
            <CheckCircle size={15} /> Experience uploaded successfully!
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #C8651B, #F4845F)',
            color: 'white',
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing...</>
          ) : (
            <><Upload size={18} /> Publish Experience</>
          )}
        </button>
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Packages Management
// ═══════════════════════════════════════════════════════════════════════════════
const PackagesSection = ({ packages: initialPackages }) => {
  const [packages, setPackages] = useState(initialPackages);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    package_name: '', description: '', price: '',
    duration: '', event_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.package_name || !form.price) return;
    try {
      setLoading(true);
      const newPkg = await createPackage(form);
      setPackages(prev => [{ ...newPkg, status: 'active', bookings_count: 0,
        media_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80' }, ...prev]);
      setSuccess(true);
      setShowCreateForm(false);
      setForm({ package_name: '', description: '', price: '', duration: '', event_date: '' });
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deletePackage(id);
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const active = packages.filter(p => p.status === 'active');
  const past   = packages.filter(p => p.status === 'past');

  return (
    <div className="px-5 pt-5 flex flex-col gap-5">

      {/* Create button */}
      <button
        onClick={() => setShowCreateForm(p => !p)}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold"
        style={{
          background: showCreateForm ? 'rgba(253,246,236,0.06)' : 'linear-gradient(135deg, #C8651B, #F4845F)',
          color: showCreateForm ? 'rgba(253,246,236,0.6)' : 'white',
          border: showCreateForm ? '1px solid rgba(253,246,236,0.1)' : 'none',
        }}
      >
        {showCreateForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Create New Package</>}
      </button>

      {/* Success */}
      {success && (
        <div className="px-4 py-3 rounded-xl text-sm flex items-center gap-2"
             style={{ background: 'rgba(45,106,79,0.2)', border: '1px solid rgba(45,106,79,0.4)', color: '#40916C' }}>
          <CheckCircle size={15} /> Package created successfully!
        </div>
      )}

      {/* Create form */}
      {showCreateForm && (
        <form onSubmit={handleCreate}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.1)' }}>
          <p className="font-display font-bold text-base mb-1" style={{ color: '#FDF6EC' }}>
            New Package
          </p>
          {[
            { key: 'package_name', placeholder: 'Package name', type: 'text' },
            { key: 'price',        placeholder: 'Price (USD)',   type: 'number' },
            { key: 'duration',     placeholder: 'Duration (e.g. 1 Full Day)', type: 'text' },
            { key: 'event_date',   placeholder: 'Event date',   type: 'date' },
          ].map(field => (
            <input
              key={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(253,246,236,0.07)',
                border: '1px solid rgba(253,246,236,0.1)',
                color: '#FDF6EC',
              }}
            />
          ))}
          <textarea
            placeholder="Description..."
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'rgba(253,246,236,0.07)', border: '1px solid rgba(253,246,236,0.1)', color: '#FDF6EC' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)', color: 'white' }}
          >
            {loading ? 'Creating...' : 'Create Package'}
          </button>
          <style>{`input::placeholder, textarea::placeholder { color: rgba(253,246,236,0.25); }`}</style>
        </form>
      )}

      {/* Active packages */}
      {active.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
             style={{ color: '#40916C' }}>Active ({active.length})</p>
          <div className="flex flex-col gap-3">
            {active.map(pkg => (
              <ProviderPackageCard key={pkg.id} pkg={pkg} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Past packages */}
      {past.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
             style={{ color: 'rgba(253,246,236,0.3)' }}>Past ({past.length})</p>
          <div className="flex flex-col gap-3">
            {past.map(pkg => (
              <ProviderPackageCard key={pkg.id} pkg={pkg} past onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Bookings Management
// ═══════════════════════════════════════════════════════════════════════════════
const BookingsSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getProviderBookings().then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.booking_status === filter);

  if (loading) return (
    <div className="flex justify-center pt-20">
      <Loader2 size={28} className="animate-spin" style={{ color: '#C8651B' }} />
    </div>
  );

  return (
    <div className="px-5 pt-5 flex flex-col gap-4">

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'confirmed', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all"
            style={{
              background: filter === f ? '#C8651B' : 'rgba(253,246,236,0.07)',
              color: filter === f ? 'white' : 'rgba(253,246,236,0.5)',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Calendar size={32} style={{ color: 'rgba(253,246,236,0.2)' }} />
          <p style={{ color: 'rgba(253,246,236,0.3)' }} className="text-sm">
            No {filter} bookings found
          </p>
        </div>
      ) : (
        filtered.map(booking => (
          <div
            key={booking.id}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={booking.tourist_image} alt={booking.tourist_name}
                   className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: '#FDF6EC' }}>
                  {booking.tourist_name}
                </p>
                <p className="text-xs" style={{ color: 'rgba(253,246,236,0.45)' }}>
                  {booking.package_name}
                </p>
              </div>
              <StatusBadge status={booking.booking_status} />
            </div>
            <div className="flex items-center justify-between pt-3"
                 style={{ borderTop: '1px solid rgba(253,246,236,0.07)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: 'rgba(253,246,236,0.4)' }}>
                  📅 {new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-xs" style={{ color: 'rgba(253,246,236,0.4)' }}>
                  👥 {booking.participants}
                </span>
              </div>
              <span className="font-display font-bold text-base" style={{ color: '#F4845F' }}>
                ${booking.total_price}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Provider Profile
// ═══════════════════════════════════════════════════════════════════════════════
const ProfileSection = ({ provider }) => {
  const [form, setForm] = useState({
    site_name: provider?.site_name || '',
    description: provider?.description || '',
    location: provider?.location || '',
    contact_email: provider?.contact_email || '',
    contact_phone: provider?.contact_phone || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800)); // mock save
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!provider) return null;

  return (
    <div className="px-5 pt-5">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img src={provider.logo_url} alt={provider.site_name}
               className="w-20 h-20 rounded-2xl object-cover border-2"
               style={{ borderColor: '#C8651B' }} />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: '#C8651B' }}>
            <Camera size={13} color="white" />
          </button>
        </div>
        <div>
          <p className="font-display font-bold text-base" style={{ color: '#FDF6EC' }}>
            {provider.site_name}
          </p>
          {provider.verification_status === 'verified' && (
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle size={13} style={{ color: '#40916C' }} />
              <span className="text-xs" style={{ color: '#40916C' }}>Verified Provider</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {[
          { key: 'site_name',     label: 'Site / Organization Name', type: 'text' },
          { key: 'location',      label: 'Location',                 type: 'text' },
          { key: 'contact_email', label: 'Contact Email',            type: 'email' },
          { key: 'contact_phone', label: 'Contact Phone',            type: 'tel' },
        ].map(field => (
          <div key={field.key}>
            <p className="text-xs font-semibold mb-1.5 uppercase tracking-wider"
               style={{ color: 'rgba(253,246,236,0.35)' }}>{field.label}</p>
            <input
              type={field.type}
              value={form[field.key]}
              onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(253,246,236,0.06)', border: '1px solid rgba(253,246,236,0.1)', color: '#FDF6EC' }}
            />
          </div>
        ))}

        <div>
          <p className="text-xs font-semibold mb-1.5 uppercase tracking-wider"
             style={{ color: 'rgba(253,246,236,0.35)' }}>About / Description</p>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'rgba(253,246,236,0.06)', border: '1px solid rgba(253,246,236,0.1)', color: '#FDF6EC' }}
          />
        </div>

        {saved && (
          <div className="px-4 py-3 rounded-xl text-sm flex items-center gap-2"
               style={{ background: 'rgba(45,106,79,0.2)', border: '1px solid rgba(45,106,79,0.4)', color: '#40916C' }}>
            <CheckCircle size={15} /> Profile updated successfully!
          </div>
        )}

        <button type="submit"
                className="w-full py-4 rounded-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)', color: 'white' }}>
          Save Changes
        </button>
        <style>{`input::placeholder, textarea::placeholder { color: rgba(253,246,236,0.25); }`}</style>
      </form>
    </div>
  );
};

// ─── Shared Sub-components ────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="p-4 rounded-2xl"
       style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.07)' }}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
         style={{ background: `${color}22`, color }}>
      {icon}
    </div>
    <p className="font-display font-bold text-2xl mb-0.5" style={{ color: '#FDF6EC' }}>{value}</p>
    <p className="text-xs font-medium mb-1" style={{ color: 'rgba(253,246,236,0.5)' }}>{label}</p>
    <p className="text-xs" style={{ color }}>{sub}</p>
  </div>
);

const RecentBookingRow = ({ booking }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
       style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.07)' }}>
    <img src={booking.tourist_image} alt={booking.tourist_name}
         className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate" style={{ color: '#FDF6EC' }}>
        {booking.tourist_name}
      </p>
      <p className="text-xs truncate" style={{ color: 'rgba(253,246,236,0.4)' }}>
        {booking.package_name}
      </p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-sm font-bold" style={{ color: '#F4845F' }}>${booking.total_price}</p>
      <StatusBadge status={booking.booking_status} small />
    </div>
  </div>
);

const ProviderPackageCard = ({ pkg, past, onDelete }) => (
  <div className="rounded-2xl overflow-hidden"
       style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)', opacity: past ? 0.6 : 1 }}>
    <div className="relative h-28">
      <img src={pkg.media_url} alt={pkg.package_name} className="w-full h-full object-cover" />
      <div className="absolute inset-0"
           style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
        <div>
          <p className="font-display font-bold text-sm" style={{ color: '#FDF6EC' }}>
            {pkg.package_name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {pkg.bookings_count} bookings · ${pkg.price}/person
          </p>
        </div>
        {!past && (
          <div className="flex gap-1.5">
            <button className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Edit3 size={12} color="white" />
            </button>
            <button
              onClick={() => onDelete(pkg.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.3)' }}
            >
              <Trash2 size={12} color="white" />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status, small }) => {
  const config = {
    confirmed: { color: '#40916C', bg: 'rgba(45,106,79,0.2)',  label: 'Confirmed' },
    pending:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.2)', label: 'Pending' },
    completed: { color: '#C8651B', bg: 'rgba(200,101,27,0.2)', label: 'Completed' },
    cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.2)',  label: 'Cancelled' },
  };
  const s = config[status] || config.pending;
  return (
    <span
      className="font-semibold rounded-full"
      style={{
        color: s.color,
        background: s.bg,
        fontSize: small ? '10px' : '11px',
        padding: small ? '2px 8px' : '4px 10px',
      }}
    >
      {s.label}
    </span>
  );
};

export default ProviderDashboard;