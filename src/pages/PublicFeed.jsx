import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '../components/Feed/PostCard';
import TopNavBar from '../components/Navbar/TopNavBar';
import BottomNavBar from '../components/Navbar/BottomNavBar';
import LoginPromptModal from '../components/Feed/LoginPromptModal';
import { getFeed } from '../services/experienceService';
import { Loader2 } from 'lucide-react';

/**
 * PublicFeed — TikTok-style full-screen vertical scrolling feed
 *
 * Features:
 *   - Snap-scroll: each post fills the entire screen
 *   - Active post tracking (for video autoplay)
 *   - Login prompt modal for interactions
 *   - Loading and error states
 *   - For You / Following tabs
 */
const PublicFeed = () => {
  // ── State ────────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('forYou');

  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const postRefs = useRef([]);

  // ── Fetch feed data ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getFeed();
        setPosts(data);
      } catch (err) {
        setError('Could not load feed. Pull to refresh.');
        console.error('Feed error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // ── Intersection Observer — detect which post is in view ─────────────────
  useEffect(() => {
    if (posts.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 } // post must be 60% visible to be "active"
    );

    postRefs.current.forEach(ref => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => observerRef.current?.disconnect();
  }, [posts]);

  // ── Handle interaction from non-logged-in user ───────────────────────────
  const handleInteract = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center"
           style={{ background: '#0D0D0D' }}>
        <Loader2
          size={36}
          className="animate-spin mb-4"
          style={{ color: '#C8651B' }}
        />
        <p className="text-sm font-medium" style={{ color: 'rgba(253,246,236,0.5)' }}>
          Loading experiences...
        </p>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-8"
           style={{ background: '#0D0D0D' }}>
        <p className="font-display text-xl text-center mb-4" style={{ color: '#FDF6EC' }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-full font-semibold"
          style={{ background: '#C8651B', color: 'white' }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Main feed render ─────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0D0D0D' }}>

      {/* Top Navigation */}
      <TopNavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Scrollable Feed Container ── */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          /* Hide scrollbar */
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Hide scrollbar for webkit */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={el => postRefs.current[index] = el}
            data-index={index}
            className="relative w-full"
            style={{
              height: '100dvh',         /* dynamic viewport height */
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          >
            <PostCard
              post={post}
              isActive={activeIndex === index}
              onInteract={handleInteract}
              isLoggedIn={false} // will come from auth context later
            />
          </div>
        ))}

        {/* ── Bottom spacer for bottom nav ── */}
        <div style={{ height: '80px', scrollSnapAlign: 'none' }} />
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default PublicFeed;
