import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Compass, ArrowLeft, Mail, Lock,
  User, Phone, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * LoginRegister — Combined auth screen with sliding tab design
 *
 * Features:
 *   - Sliding Login / Register tabs
 *   - Tourist vs Provider role selection on Register
 *   - DEV role switcher on Login (remove when backend is ready)
 *   - Form validation
 *   - Password show/hide
 *   - Loading states
 *   - Error messages
 *   - Auto-redirect after login based on role
 */
const LoginRegister = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // ── Tab state: 'login' | 'register' ─────────────────────────────────────
  const [activeTab, setActiveTab] = useState('login');

  // ── Login form state ─────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // ── DEV ONLY: role switcher for testing ──────────────────────────────────
  // Remove this when real backend is connected
  const [devRole, setDevRole] = useState('tourist');

  // ── Register form state ──────────────────────────────────────────────────
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role: 'tourist',
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Handle Login Submit ──────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginForm.email.trim()) return setLoginError('Email is required.');
    if (!loginForm.password)     return setLoginError('Password is required.');

    try {
      setLoginLoading(true);

      // ── MOCK LOGIN (replace with real API when backend is ready) ──
      await new Promise(r => setTimeout(r, 1200));

      const mockResponse = {
        token: 'mock_jwt_token_12345',
        user: {
          id: devRole === 'provider' ? 2 : devRole === 'admin' ? 3 : 1,
          full_name: devRole === 'provider'
            ? 'Bwindi Cultural Tours'
            : devRole === 'admin'
            ? 'Platform Admin'
            : 'Alex Mugisha',
          email: loginForm.email,
          role: devRole, // ← controlled by DEV switcher
          profile_image: devRole === 'tourist'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
            : null,
        },
      };
      // ── END MOCK ──

      // Real API call (uncomment when backend ready):
      // const mockResponse = await login(loginForm);

      loginUser(mockResponse.user, mockResponse.token);

      // Redirect based on role
      if (mockResponse.user.role === 'provider') {
        navigate('/provider/dashboard');
      } else if (mockResponse.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/feed');
      }

    } catch (err) {
      setLoginError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Handle Register Submit ───────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerForm.full_name.trim())  return setRegisterError('Full name is required.');
    if (!registerForm.email.trim())      return setRegisterError('Email is required.');
    if (!registerForm.password)          return setRegisterError('Password is required.');
    if (registerForm.password.length < 6)
      return setRegisterError('Password must be at least 6 characters.');
    if (registerForm.password !== registerForm.confirm_password)
      return setRegisterError('Passwords do not match.');

    try {
      setRegisterLoading(true);

      // Mock register — replace with real API when backend ready
      await new Promise(r => setTimeout(r, 1500));
      // await register(registerForm);

      setRegisterSuccess(true);
      setTimeout(() => {
        setRegisterSuccess(false);
        setActiveTab('login');
        setLoginForm({ email: registerForm.email, password: '' });
      }, 2000);

    } catch (err) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #1A1040 0%, #0D1F16 60%, #1A1040 100%)',
      }}
    >
      {/* ── Decorative background circles ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #C8651B, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #2D6A4F, transparent)' }} />
      </div>

      {/* ── Top: Back button + Logo ── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-6 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(253,246,236,0.08)', color: '#FDF6EC' }}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)' }}>
            <Compass size={16} color="white" />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: '#FDF6EC' }}>
            CulturaTour
          </span>
        </div>

        <div className="w-10" />
      </div>

      {/* ── Heading ── */}
      <div className="px-6 mb-8 relative z-10">
        <h1 className="font-display text-3xl font-bold mb-2" style={{ color: '#FDF6EC' }}>
          {activeTab === 'login' ? 'Welcome back' : 'Join us today'}
        </h1>
        <p className="text-sm" style={{ color: 'rgba(253,246,236,0.5)' }}>
          {activeTab === 'login'
            ? 'Log in to explore cultural experiences'
            : 'Create an account to start your cultural journey'}
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="px-6 mb-8 relative z-10">
        <div className="flex rounded-2xl p-1"
             style={{ background: 'rgba(253,246,236,0.07)' }}>
          {['login', 'register'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{
                background: activeTab === tab
                  ? 'linear-gradient(135deg, #C8651B, #F4845F)'
                  : 'transparent',
                color: activeTab === tab ? 'white' : 'rgba(253,246,236,0.45)',
                boxShadow: activeTab === tab ? '0 4px 15px rgba(200,101,27,0.35)' : 'none',
              }}
            >
              {tab === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Form Area ── */}
      <div className="flex-1 px-6 relative z-10 pb-12">

        {/* ════════════════ LOGIN FORM ════════════════ */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* ── DEV ONLY: Role switcher ── */}
            {/* Remove this entire block when backend is connected */}
            <div className="px-4 py-3 rounded-2xl"
                 style={{ background: 'rgba(200,101,27,0.08)', border: '1px dashed rgba(200,101,27,0.3)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2"
                 style={{ color: 'rgba(244,132,95,0.7)' }}>
                🛠 Dev Mode — Login as:
              </p>
              <div className="flex gap-2">
                {['tourist', 'provider', 'admin'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setDevRole(role)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                    style={{
                      background: devRole === role ? '#C8651B' : 'rgba(253,246,236,0.07)',
                      color: devRole === role ? 'white' : 'rgba(253,246,236,0.45)',
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            {/* ── END DEV block ── */}

            {/* Email */}
            <InputField
              icon={<Mail size={17} />}
              type="email"
              placeholder="Email address"
              value={loginForm.email}
              onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
            />

            {/* Password */}
            <InputField
              icon={<Lock size={17} />}
              type={showLoginPassword ? 'text' : 'password'}
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
              rightIcon={
                <button type="button" onClick={() => setShowLoginPassword(p => !p)}>
                  {showLoginPassword
                    ? <EyeOff size={17} style={{ color: 'rgba(253,246,236,0.4)' }} />
                    : <Eye size={17} style={{ color: 'rgba(253,246,236,0.4)' }} />
                  }
                </button>
              }
            />

            {/* Forgot password */}
            <button
              type="button"
              className="text-right text-sm font-medium"
              style={{ color: '#F4845F' }}
            >
              Forgot password?
            </button>

            {/* Error */}
            {loginError && <ErrorMessage message={loginError} />}

            {/* Submit */}
            <SubmitButton
              loading={loginLoading}
              label={`Log In as ${devRole.charAt(0).toUpperCase() + devRole.slice(1)}`}
              loadingLabel="Logging in..."
            />

            {/* Divider */}
            <Divider text="or continue with" />

            {/* Social login placeholders */}
            <div className="flex gap-3">
              <SocialButton label="Google"   color="#DB4437" />
              <SocialButton label="Facebook" color="#4267B2" />
            </div>

            {/* Switch to register */}
            <p className="text-center text-sm mt-2" style={{ color: 'rgba(253,246,236,0.5)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="font-semibold"
                style={{ color: '#F4845F' }}
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        {/* ════════════════ REGISTER FORM ════════════════ */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            {/* User Type Selector */}
            <div>
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest"
                 style={{ color: 'rgba(253,246,236,0.45)' }}>
                I am joining as
              </p>
              <div className="grid grid-cols-2 gap-3">
                <UserTypeCard
                  label="Tourist"
                  description="Discover & book experiences"
                  emoji="🧭"
                  selected={registerForm.role === 'tourist'}
                  onSelect={() => setRegisterForm(p => ({ ...p, role: 'tourist' }))}
                />
                <UserTypeCard
                  label="Provider"
                  description="Share cultural experiences"
                  emoji="🏛️"
                  selected={registerForm.role === 'provider'}
                  onSelect={() => setRegisterForm(p => ({ ...p, role: 'provider' }))}
                />
              </div>
            </div>

            {/* Full name */}
            <InputField
              icon={<User size={17} />}
              type="text"
              placeholder={registerForm.role === 'provider'
                ? 'Cultural site / Organization name'
                : 'Full name'}
              value={registerForm.full_name}
              onChange={e => setRegisterForm(p => ({ ...p, full_name: e.target.value }))}
            />

            {/* Email */}
            <InputField
              icon={<Mail size={17} />}
              type="email"
              placeholder="Email address"
              value={registerForm.email}
              onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
            />

            {/* Phone */}
            <InputField
              icon={<Phone size={17} />}
              type="tel"
              placeholder="Phone number (optional)"
              value={registerForm.phone}
              onChange={e => setRegisterForm(p => ({ ...p, phone: e.target.value }))}
            />

            {/* Password */}
            <InputField
              icon={<Lock size={17} />}
              type={showRegPassword ? 'text' : 'password'}
              placeholder="Create password"
              value={registerForm.password}
              onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
              rightIcon={
                <button type="button" onClick={() => setShowRegPassword(p => !p)}>
                  {showRegPassword
                    ? <EyeOff size={17} style={{ color: 'rgba(253,246,236,0.4)' }} />
                    : <Eye size={17} style={{ color: 'rgba(253,246,236,0.4)' }} />
                  }
                </button>
              }
            />

            {/* Confirm password */}
            <InputField
              icon={<Lock size={17} />}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={registerForm.confirm_password}
              onChange={e => setRegisterForm(p => ({ ...p, confirm_password: e.target.value }))}
              rightIcon={
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)}>
                  {showConfirmPassword
                    ? <EyeOff size={17} style={{ color: 'rgba(253,246,236,0.4)' }} />
                    : <Eye size={17} style={{ color: 'rgba(253,246,236,0.4)' }} />
                  }
                </button>
              }
            />

            {/* Error */}
            {registerError && <ErrorMessage message={registerError} />}

            {/* Success */}
            {registerSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                   style={{ background: 'rgba(45,106,79,0.3)', border: '1px solid rgba(45,106,79,0.5)' }}>
                <span style={{ color: '#40916C' }}>✓</span>
                <p className="text-sm font-medium" style={{ color: '#40916C' }}>
                  Account created! Redirecting to login...
                </p>
              </div>
            )}

            {/* Submit */}
            <SubmitButton
              loading={registerLoading}
              label="Create Account"
              loadingLabel="Creating account..."
            />

            {/* Terms */}
            <p className="text-center text-xs" style={{ color: 'rgba(253,246,236,0.35)' }}>
              By creating an account you agree to our{' '}
              <span style={{ color: '#F4845F' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: '#F4845F' }}>Privacy Policy</span>
            </p>

            {/* Switch to login */}
            <p className="text-center text-sm" style={{ color: 'rgba(253,246,236,0.5)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-semibold"
                style={{ color: '#F4845F' }}
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Reusable Sub-components ──────────────────────────────────────────────────

const InputField = ({ icon, rightIcon, ...props }) => (
  <div className="flex items-center gap-3 px-4 py-4 rounded-2xl"
       style={{ background: 'rgba(253,246,236,0.07)', border: '1px solid rgba(253,246,236,0.1)' }}>
    <span style={{ color: 'rgba(253,246,236,0.35)', flexShrink: 0 }}>{icon}</span>
    <input
      {...props}
      className="flex-1 bg-transparent text-sm outline-none"
      style={{ color: '#FDF6EC' }}
    />
    {rightIcon && <span style={{ flexShrink: 0 }}>{rightIcon}</span>}
    <style>{`input::placeholder { color: rgba(253,246,236,0.3); }`}</style>
  </div>
);

const UserTypeCard = ({ label, description, emoji, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all"
    style={{
      background: selected ? 'rgba(200,101,27,0.2)' : 'rgba(253,246,236,0.05)',
      border: selected ? '1.5px solid #C8651B' : '1.5px solid rgba(253,246,236,0.1)',
      boxShadow: selected ? '0 0 20px rgba(200,101,27,0.2)' : 'none',
    }}
  >
    <span className="text-2xl">{emoji}</span>
    <span className="font-semibold text-sm" style={{ color: selected ? '#F4845F' : '#FDF6EC' }}>
      {label}
    </span>
    <span className="text-xs leading-tight" style={{ color: 'rgba(253,246,236,0.4)' }}>
      {description}
    </span>
  </button>
);

const SubmitButton = ({ loading, label, loadingLabel }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 mt-2 transition-opacity"
    style={{
      background: loading
        ? 'rgba(200,101,27,0.5)'
        : 'linear-gradient(135deg, #C8651B, #F4845F)',
      color: 'white',
      boxShadow: loading ? 'none' : '0 4px 20px rgba(200,101,27,0.4)',
      opacity: loading ? 0.8 : 1,
    }}
  >
    {loading ? (
      <>
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        {loadingLabel}
      </>
    ) : (
      <>
        {label}
        <ChevronRight size={18} />
      </>
    )}
  </button>
);

const ErrorMessage = ({ message }) => (
  <div className="px-4 py-3 rounded-xl text-sm"
       style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
    ⚠️ {message}
  </div>
);

const Divider = ({ text }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px" style={{ background: 'rgba(253,246,236,0.1)' }} />
    <span className="text-xs" style={{ color: 'rgba(253,246,236,0.3)' }}>{text}</span>
    <div className="flex-1 h-px" style={{ background: 'rgba(253,246,236,0.1)' }} />
  </div>
);

const SocialButton = ({ label, color }) => (
  <button
    type="button"
    className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
    style={{ background: 'rgba(253,246,236,0.06)', border: '1px solid rgba(253,246,236,0.1)', color: '#FDF6EC' }}
  >
    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    {label}
  </button>
);

export default LoginRegister;