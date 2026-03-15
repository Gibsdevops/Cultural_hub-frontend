import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, MapPin, Compass } from 'lucide-react';
import SlideIndicator from '../components/Splash/SlideIndicator';
import { getPromotionalSlides } from '../services/adminService';

/**
 * SplashScreen — Entry point of the Cultural Tourism Platform
 *
 * Features:
 *   - Full-screen cinematic slide show
 *   - Auto-advances every 5 seconds
 *   - Manual prev/next navigation
 *   - Dot indicators
 *   - Ken Burns zoom animation on images
 *   - "Continue" button to enter the feed
 *   - Loading and error states
 */
const SplashScreen = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // ── Fetch slides from API / mock ───────────────────────────────────────────
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const data = await getPromotionalSlides();
        setSlides(data);
      } catch (err) {
        setError('Failed to load slides. Please try again.');
        console.error('Slide fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // ── Auto-advance slides every 5 seconds ───────────────────────────────────
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // ── Slide navigation ───────────────────────────────────────────────────────
  const transitionTo = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 400);
  };

  const goToNext = () => {
    if (slides.length === 0) return;
    transitionTo((currentSlide + 1) % slides.length);
  };

  const goToPrev = () => {
    if (slides.length === 0) return;
    transitionTo((currentSlide - 1 + slides.length) % slides.length);
  };

  // ── Navigate to feed ───────────────────────────────────────────────────────
  const handleContinue = () => {
    navigate('/feed');
  };

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1A1040 0%, #2D1B69 50%, #1B4332 100%)',
        }}
      >
        {/* Animated logo */}
        <div className="mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto"
            style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)' }}
          >
            <Compass size={32} color="white" />
          </div>
          <p
            className="font-display text-3xl font-bold text-center"
            style={{ color: '#FDF6EC' }}
          >
            CulturaTour
          </p>
          <p className="text-sm text-center mt-1" style={{ color: '#F4845F' }}>
            Discover. Experience. Connect.
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: '#C8651B',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center p-6"
        style={{ background: '#1A1040' }}
      >
        <p
          className="font-display text-2xl text-center mb-4"
          style={{ color: '#FDF6EC' }}
        >
          Something went wrong
        </p>
        <p className="text-center mb-8" style={{ color: '#F4845F' }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-full font-semibold"
          style={{ background: '#C8651B', color: 'white' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const slide = slides[currentSlide];
  if (!slide) return null;

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: '#1A1040' }}
    >
      {/* ── Ken Burns CSS Animation ── */}
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translateX(0px)   translateY(0px); }
          25%  { transform: scale(1.06) translateX(-8px)  translateY(-4px); }
          50%  { transform: scale(1.08) translateX(4px)   translateY(-8px); }
          75%  { transform: scale(1.04) translateX(-4px)  translateY(4px); }
          100% { transform: scale(1)    translateX(0px)   translateY(0px); }
        }
        .ken-burns {
          animation: kenBurns 10s ease-in-out infinite;
        }
      `}</style>

      {/* ── Background Image ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          key={slide.image_url}
          src={slide.image_url}
          alt={slide.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover ${imageLoaded ? 'ken-burns' : ''}`}
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(26,16,64,0.2) 0%, rgba(26,16,64,0.1) 30%, rgba(26,16,64,0.7) 65%, rgba(26,16,64,0.97) 100%)',
          }}
        />
      </div>

      {/* ── Top Bar: Logo + Skip ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-10 pb-4 z-20">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C8651B, #F4845F)' }}
          >
            <Compass size={18} color="white" />
          </div>
          <span
            className="font-display font-bold text-xl"
            style={{ color: '#FDF6EC' }}
          >
            CulturaTour
          </span>
        </div>

        {/* Skip button */}
        <button
          onClick={handleContinue}
          className="text-sm font-medium px-4 py-1.5 rounded-full border"
          style={{
            color: '#FDF6EC',
            borderColor: 'rgba(253,246,236,0.3)',
            background: 'rgba(253,246,236,0.08)',
          }}
        >
          Skip
        </button>
      </div>

      {/* ── Left Arrow ── */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(253,246,236,0.15)', color: '#FDF6EC' }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* ── Right Arrow ── */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(253,246,236,0.15)', color: '#FDF6EC' }}
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Bottom Content ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-6 pb-12 transition-all duration-500 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Location tag */}
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={13} style={{ color: '#F4845F' }} />
          <span
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: '#F4845F' }}
          >
            Cultural Experience
          </span>
        </div>

        {/* Slide Title */}
        <h1
          className="font-display font-bold leading-tight mb-3"
          style={{
            color: '#FDF6EC',
            fontSize: 'clamp(1.75rem, 5vw, 2.8rem)',
          }}
        >
          {slide.title}
        </h1>

        {/* Slide Description */}
        <p
          className="text-sm leading-relaxed mb-8 max-w-md"
          style={{ color: 'rgba(253,246,236,0.75)' }}
        >
          {slide.description}
        </p>

        {/* Indicators + CTA */}
        <div className="flex items-center justify-between">
          <SlideIndicator
            total={slides.length}
            current={currentSlide}
            onDotClick={transitionTo}
          />

          {/* CTA Button */}
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
            style={{
              background: 'linear-gradient(135deg, #C8651B, #F4845F)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(200,101,27,0.5)',
            }}
          >
            {slide.cta || 'Explore'}
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Slide counter */}
        <p
          className="text-xs mt-4 font-medium"
          style={{ color: 'rgba(253,246,236,0.4)' }}
        >
          {currentSlide + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;