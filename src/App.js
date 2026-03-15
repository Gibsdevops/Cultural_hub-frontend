import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ── Pages ────────────────────────────────────────────────────────────────────
import SplashScreen        from './pages/SplashScreen';
import PublicFeed          from './pages/PublicFeed';
import LoginRegister       from './pages/LoginRegister';
import CulturalSiteProfile from './pages/CulturalSiteProfile';
import PackageDetails      from './pages/PackageDetails';
import BookingScreen       from './pages/BookingScreen';
import TouristProfile      from './pages/TouristProfile';
import TouristBookings     from './pages/TouristBookings';
import ProviderDashboard from './pages/ProviderDashboard';

// ── Auth ─────────────────────────────────────────────────────────────────────
import { useAuth } from './context/AuthContext';

/**
 * ProtectedRoute — redirects to /login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return null; // wait for session restore before deciding
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

/**
 * ComingSoon — placeholder for pages not yet built
 */
const ComingSoon = ({ label }) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center gap-3"
    style={{ background: '#1A1040', color: '#FDF6EC' }}
  >
    <p className="font-display text-xl font-bold">{label}</p>
    <p style={{ color: 'rgba(253,246,236,0.4)', fontSize: '14px' }}>Coming soon</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <Router>
      <Routes>

        {/* ── Public Routes (no login required) ── */}
        <Route path="/"                    element={<SplashScreen />} />
        <Route path="/feed"                element={<PublicFeed />} />
        <Route path="/login"               element={<LoginRegister />} />
        <Route path="/register"            element={<LoginRegister />} />
        <Route path="/site/:siteId"        element={<CulturalSiteProfile />} />
        <Route path="/packages/:packageId" element={<PackageDetails />} />
        <Route path="/search"              element={<ComingSoon label="Search & Discover" />} />

        {/* ── Protected Tourist Routes ── */}
        <Route path="/booking/:packageId" element={
          <ProtectedRoute><BookingScreen /></ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute><TouristBookings /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><TouristProfile /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><ComingSoon label="Notifications" /></ProtectedRoute>
        } />

        {/* ── Protected Provider Routes ── */}
        <Route path="/provider/dashboard" element={
          <ProtectedRoute><ProviderDashboard /></ProtectedRoute>
        } />

        {/* ── Protected Admin Routes ── */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><ComingSoon label="Admin Dashboard" /></ProtectedRoute>
        } />

        {/* ── Catch-all: redirect unknown routes to splash ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;