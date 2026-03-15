import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Compass, Heart, MessageCircle, Bookmark } from 'lucide-react';

/**
 * LoginPromptModal — shown when non-logged-in user taps an interaction button
 *
 * Props:
 *   isOpen   {bool}   — controls visibility
 *   onClose  {func}   — close handler
 */
const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      {/* Modal Sheet */}
      <div
        className="w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
        style={{ background: '#1A1040' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full mx-auto mb-6"
             style={{ background: 'rgba(253,246,236,0.2)' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(253,246,236,0.1)' }}
        >
          <X size={16} color="white" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)' }}>
            <Compass size={20} color="white" />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: '#FDF6EC' }}>
            CulturaTour
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#FDF6EC' }}>
          Join the experience
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(253,246,236,0.6)' }}>
          Log in or create an account to like, comment, save, and book cultural experiences.
        </p>

        {/* Feature icons */}
        <div className="flex gap-6 mb-8">
          {[
            { icon: <Heart size={18} />, label: 'Like' },
            { icon: <MessageCircle size={18} />, label: 'Comment' },
            { icon: <Bookmark size={18} />, label: 'Save' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(200,101,27,0.2)', color: '#F4845F' }}>
                {icon}
              </div>
              <span className="text-xs" style={{ color: 'rgba(253,246,236,0.5)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Login button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl font-semibold text-base mb-3 transition-transform active:scale-98"
          style={{
            background: 'linear-gradient(135deg, #C8651B, #F4845F)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(200,101,27,0.4)',
          }}
        >
          Log In
        </button>

        {/* Register button */}
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 rounded-2xl font-semibold text-base border"
          style={{
            color: '#FDF6EC',
            borderColor: 'rgba(253,246,236,0.2)',
            background: 'rgba(253,246,236,0.05)',
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;