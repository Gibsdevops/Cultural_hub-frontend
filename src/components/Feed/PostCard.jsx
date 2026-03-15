import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * PostCard — Full-screen TikTok-style post card
 *
 * Props:
 *   post        {object}  — experience post data
 *   isActive    {bool}    — whether this post is currently in view
 *   onInteract  {func}    — called when non-logged-in user taps action buttons
 *   isLoggedIn  {bool}    — whether user is authenticated
 */
const PostCard = ({ post, isActive, onInteract, isLoggedIn = false }) => {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef(null);
  const lastTapRef = useRef(0);
  const navigate = useNavigate();

  // ── Handle like toggle ───────────────────────────────────────────────────
  const handleLike = () => {
    if (!isLoggedIn) { onInteract(); return; }
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  // ── Double-tap to like (mobile gesture) ──────────────────────────────────
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!isLoggedIn) { onInteract(); return; }
      if (!liked) {
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
    }
    lastTapRef.current = now;
  };

  // ── Navigate to cultural site profile ────────────────────────────────────
  const handleProviderClick = (e) => {
    e.stopPropagation();
    navigate(`/site/${post.provider.id}`);
  };

  // ── Format large numbers ─────────────────────────────────────────────────
  const formatCount = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#0D0D0D' }}
      onClick={handleDoubleTap}
    >
      {/* ── Media (Image or Video) ── */}
      {post.media_type === 'video' ? (
        <video
          ref={videoRef}
          src={post.media_url}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted={muted}
          playsInline
          autoPlay={isActive}
        />
      ) : (
        <img
          src={post.media_url}
          alt={post.caption}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* ── Gradient overlays ── */}
      <div
        className="absolute top-0 left-0 right-0 h-40 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          height: '65%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        }}
      />

      {/* ── Floating Heart Animation (double tap) ── */}
      {showHeart && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          style={{ animation: 'heartPop 0.9s ease-out forwards' }}
        >
          <Heart
            size={90}
            fill="#F4845F"
            style={{ color: '#F4845F', filter: 'drop-shadow(0 0 20px rgba(244,132,95,0.8))' }}
          />
        </div>
      )}

      {/* ── Top: Provider info (clickable → site profile) ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4">

        {/* Clickable provider logo + name */}
        <button
          onClick={handleProviderClick}
          className="flex items-center gap-3 text-left"
        >
          {/* Provider logo */}
          <div className="relative flex-shrink-0">
            <img
              src={post.provider.logo_url}
              alt={post.provider.site_name}
              className="w-10 h-10 rounded-full object-cover border-2"
              style={{ borderColor: '#C8651B' }}
            />
            {/* Green online dot */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-black"
              style={{ backgroundColor: '#2D6A4F' }}
            />
          </div>

          {/* Provider name + location */}
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              {post.provider.site_name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} style={{ color: '#F4845F' }} />
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {post.provider.location}
              </p>
            </div>
          </div>
        </button>

        {/* More options button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <MoreHorizontal size={16} color="white" />
        </button>
      </div>

      {/* ── Right Side: Action Buttons (TikTok style) ── */}
      <div className="absolute right-4 bottom-36 z-20 flex flex-col items-center gap-5">

        {/* Like Button */}
        <ActionButton
          icon={
            <Heart
              size={26}
              fill={liked ? '#F4845F' : 'none'}
              style={{ color: liked ? '#F4845F' : 'white' }}
            />
          }
          label={formatCount(likeCount)}
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          active={liked}
          activeColor="#F4845F"
        />

        {/* Comment Button */}
        <ActionButton
          icon={<MessageCircle size={26} color="white" />}
          label={formatCount(post.comments_count)}
          onClick={(e) => { e.stopPropagation(); onInteract('comment'); }}
        />

        {/* Share Button */}
        <ActionButton
          icon={<Share2 size={26} color="white" />}
          label="Share"
          onClick={(e) => { e.stopPropagation(); onInteract('share'); }}
        />

        {/* Save Button */}
        <ActionButton
          icon={
            <Bookmark
              size={26}
              fill={saved ? '#C8651B' : 'none'}
              style={{ color: saved ? '#C8651B' : 'white' }}
            />
          }
          label="Save"
          onClick={(e) => {
            e.stopPropagation();
            if (!isLoggedIn) { onInteract(); return; }
            setSaved(prev => !prev);
          }}
          active={saved}
          activeColor="#C8651B"
        />

        {/* Mute toggle (video posts only) */}
        {post.media_type === 'video' && (
          <ActionButton
            icon={muted
              ? <VolumeX size={22} color="white" />
              : <Volume2 size={22} color="white" />
            }
            onClick={(e) => { e.stopPropagation(); setMuted(prev => !prev); }}
          />
        )}
      </div>

      {/* ── Bottom: Caption + Tags ── */}
      <div className="absolute bottom-0 left-0 right-14 z-20 px-4 pb-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags?.map(tag => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: 'rgba(200,101,27,0.25)',
                color: '#F4845F',
                border: '1px solid rgba(244,132,95,0.3)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Caption */}
        <CaptionText text={post.caption} />
      </div>

      {/* ── Heart pop animation ── */}
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(0);   opacity: 1; }
          50%  { transform: scale(1.2); opacity: 1; }
          80%  { transform: scale(1.0); opacity: 0.9; }
          100% { transform: scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ─── ActionButton ─────────────────────────────────────────────────────────────
const ActionButton = ({ icon, label, onClick, active, activeColor }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1">
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
      style={{ background: 'rgba(255,255,255,0.12)' }}
    >
      {icon}
    </div>
    {label && (
      <span
        className="text-xs font-semibold"
        style={{ color: active ? activeColor : 'rgba(255,255,255,0.85)' }}
      >
        {label}
      </span>
    )}
  </button>
);

// ─── CaptionText — expandable ─────────────────────────────────────────────────
const CaptionText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text?.length > 100;

  return (
    <p className="text-white text-sm leading-relaxed"
       style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
      {isLong && !expanded ? text.slice(0, 100) + '... ' : text}
      {isLong && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(prev => !prev); }}
          className="font-semibold ml-1"
          style={{ color: '#F4845F' }}
        >
          {expanded ? 'less' : 'more'}
        </button>
      )}
    </p>
  );
};

export default PostCard;