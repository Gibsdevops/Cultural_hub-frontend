import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Get cultural site profile by ID
 * GET /cultural-sites/:id
 */
export const getCulturalSite = async (siteId) => {
  try {
    const response = await API.get(`/cultural-sites/${siteId}`);
    return response.data;
  } catch (error) {
    console.warn('API not ready, using mock site data');
    return MOCK_SITES[siteId] || MOCK_SITES[101];
  }
};

/**
 * Follow / Unfollow a cultural site
 * POST /cultural-sites/:id/follow
 */
export const followSite = async (siteId) => {
  try {
    const response = await API.post(`/cultural-sites/${siteId}/follow`);
    return response.data;
  } catch (error) {
    console.warn('Follow API not ready');
    return { followed: true };
  }
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_SITES = {
  101: {
    id: 101,
    site_name: 'Bwindi Impenetrable Forest',
    description:
      'One of Africa\'s most biologically diverse areas, Bwindi Impenetrable National Park is home to almost half of the world\'s remaining mountain gorillas. Our cultural tours combine wildlife experiences with authentic encounters with the indigenous Batwa people, the original forest dwellers.',
    location: 'Kanungu District, South-western Uganda',
    contact_email: 'info@bwindi-tours.ug',
    contact_phone: '+256 772 123 456',
    logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=200&q=80',
    cover_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=85',
    verification_status: 'verified',
    followers_count: 4821,
    posts_count: 47,
    packages_count: 6,
    experiences: [
      { id: 1, media_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80', media_type: 'image', likes_count: 2341 },
      { id: 2, media_url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=80', media_type: 'image', likes_count: 987 },
      { id: 3, media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&q=80', media_type: 'image', likes_count: 1543 },
      { id: 4, media_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80', media_type: 'image', likes_count: 762 },
      { id: 5, media_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=80', media_type: 'image', likes_count: 1120 },
      { id: 6, media_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', media_type: 'image', likes_count: 634 },
    ],
    packages: [
      {
        id: 1,
        package_name: 'Gorilla Trekking Experience',
        description: 'A full-day guided trek through the impenetrable forest to observe mountain gorillas in their natural habitat.',
        price: 700,
        duration: '1 Day',
        event_date: '2026-04-15',
        media_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
        status: 'active',
      },
      {
        id: 2,
        package_name: 'Batwa Cultural Immersion',
        description: 'Spend a day with the indigenous Batwa pygmies learning their forest traditions, music and survival skills.',
        price: 120,
        duration: '1 Day',
        event_date: '2026-04-20',
        media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80',
        status: 'active',
      },
      {
        id: 3,
        package_name: 'Forest Birds & Nature Walk',
        description: 'Guided nature walk spotting over 350 bird species and rare primates through ancient forest trails.',
        price: 85,
        duration: '4 Hours',
        event_date: '2026-03-28',
        media_url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80',
        status: 'past',
      },
    ],
  },
  102: {
    id: 102,
    site_name: 'Kazinga Cultural Village',
    description: 'Experience the rich traditions of the Bakiga people in the heart of Kabale.',
    location: 'Kabale, Western Uganda',
    contact_email: 'hello@kazinga.ug',
    contact_phone: '+256 701 987 654',
    logo_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    cover_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=85',
    verification_status: 'verified',
    followers_count: 2103,
    posts_count: 31,
    packages_count: 4,
    experiences: [
      { id: 7,  media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&q=80', media_type: 'image', likes_count: 876 },
      { id: 8,  media_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=80', media_type: 'image', likes_count: 543 },
      { id: 9,  media_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80', media_type: 'image', likes_count: 321 },
    ],
    packages: [
      {
        id: 4,
        package_name: 'Bakiga Dance & Music Festival',
        description: 'Join the vibrant annual celebration of Bakiga culture with traditional dance, music and local cuisine.',
        price: 45,
        duration: '1 Day',
        event_date: '2026-05-10',
        media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80',
        status: 'active',
      },
    ],
  },
};

export { MOCK_SITES };