import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Fetch public experience feed
 * Endpoint: GET /experiences
 */
export const getFeed = async () => {
  try {
    const response = await API.get('/experiences');
    return response.data;
  } catch (error) {
    console.warn('API not ready, using mock feed:', error.message);
    return MOCK_FEED;
  }
};

// ─── Mock Feed Data ──────────────────────────────────────────────────────────
const MOCK_FEED = [
  {
    id: 1,
    provider: {
      id: 101,
      site_name: 'Bwindi Impenetrable Forest',
      logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=100&q=80',
      location: 'Kanungu, Uganda',
    },
    media_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1080&q=90',
    media_type: 'image',
    caption: 'Trek through ancient forests where mountain gorillas roam freely. An experience that will change your life forever. 🦍🌿',
    likes_count: 2341,
    comments_count: 184,
    is_liked: false,
    tags: ['Gorillas', 'Forest', 'Wildlife'],
  },
  {
    id: 2,
    provider: {
      id: 102,
      site_name: 'Kazinga Cultural Village',
      logo_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
      location: 'Kabale, Uganda',
    },
    media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1080&q=90',
    media_type: 'image',
    caption: 'Immerse yourself in authentic Bakiga traditions — music, dance, and storytelling passed down through generations. ✨🥁',
    likes_count: 1876,
    comments_count: 97,
    is_liked: false,
    tags: ['Culture', 'Dance', 'Tradition'],
  },
  {
    id: 3,
    provider: {
      id: 103,
      site_name: 'Source of the Nile Tours',
      logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      location: 'Jinja, Uganda',
    },
    media_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1080&q=90',
    media_type: 'image',
    caption: 'Stand at the source of the world\'s longest river. Feel the power of the Nile as it begins its 6,650 km journey to the Mediterranean. 🌊',
    likes_count: 3102,
    comments_count: 256,
    is_liked: true,
    tags: ['Nile', 'Adventure', 'History'],
  },
  {
    id: 4,
    provider: {
      id: 104,
      site_name: 'Rwenzori Mountain Safaris',
      logo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
      location: 'Fort Portal, Uganda',
    },
    media_url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1080&q=90',
    media_type: 'image',
    caption: 'The Mountains of the Moon await. Snow-capped peaks, glacial lakes, and some of the rarest biodiversity on Earth. 🏔️❄️',
    likes_count: 987,
    comments_count: 63,
    is_liked: false,
    tags: ['Mountains', 'Hiking', 'Nature'],
  },
  {
    id: 5,
    provider: {
      id: 105,
      site_name: 'Ndere Cultural Centre',
      logo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      location: 'Kampala, Uganda',
    },
    media_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1080&q=90',
    media_type: 'image',
    caption: 'A living celebration of Ugandan culture. Watch 56 tribes come alive through music, dance, and drama every weekend. 🎭🎶',
    likes_count: 4210,
    comments_count: 312,
    is_liked: false,
    tags: ['Music', 'Drama', 'Kampala'],
  },
];