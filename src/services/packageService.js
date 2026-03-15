import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Get single package details
 * GET /packages/:id
 */
export const getPackageById = async (packageId) => {
  try {
    const response = await API.get(`/packages/${packageId}`);
    return response.data;
  } catch (error) {
    console.warn('API not ready, using mock package');
    return MOCK_PACKAGES[packageId] || MOCK_PACKAGES[1];
  }
};

/**
 * Get all packages for a provider
 * GET /packages?provider_id=:id
 */
export const getProviderPackages = async (providerId) => {
  try {
    const response = await API.get(`/packages?provider_id=${providerId}`);
    return response.data;
  } catch (error) {
    return Object.values(MOCK_PACKAGES).filter(p => p.provider_id === providerId);
  }
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_PACKAGES = {
  1: {
    id: 1,
    provider_id: 101,
    provider: {
      id: 101,
      site_name: 'Bwindi Impenetrable Forest',
      logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=200&q=80',
      location: 'Kanungu District, Uganda',
      verification_status: 'verified',
    },
    package_name: 'Gorilla Trekking Experience',
    description:
      'Embark on a life-changing journey into the heart of Bwindi Impenetrable Forest. Led by expert guides and Uganda Wildlife Authority rangers, you will track habituated mountain gorilla families through ancient forest trails.\n\nThis is one of the most extraordinary wildlife encounters on Earth — sitting just metres from a gorilla family in their natural habitat is a profoundly moving experience that stays with you forever.',
    price: 700,
    duration: '1 Full Day',
    event_date: '2026-04-15',
    max_participants: 8,
    difficulty: 'Moderate',
    includes: [
      'Expert wildlife guide',
      'Uganda Wildlife Authority ranger',
      'Park entry permits',
      'Packed lunch & refreshments',
      'Certificate of completion',
      'Ground transport within park',
    ],
    excludes: [
      'International/domestic flights',
      'Accommodation',
      'Travel insurance',
      'Personal expenses',
    ],
    media: [
      { id: 1, media_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1080&q=85', media_type: 'image' },
      { id: 2, media_url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1080&q=85', media_type: 'image' },
      { id: 3, media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1080&q=85', media_type: 'image' },
    ],
    schedule: [
      { time: '05:30 AM', activity: 'Hotel pickup & transfer to park HQ' },
      { time: '07:00 AM', activity: 'Briefing at UWA headquarters' },
      { time: '08:00 AM', activity: 'Begin gorilla trek into the forest' },
      { time: '10:00 AM', activity: '1-hour visit with gorilla family' },
      { time: '12:30 PM', activity: 'Lunch in the forest' },
      { time: '02:00 PM', activity: 'Return trek & debrief' },
      { time: '04:00 PM', activity: 'Transfer back to hotel' },
    ],
    status: 'active',
    bookings_count: 143,
  },
  2: {
    id: 2,
    provider_id: 101,
    provider: {
      id: 101,
      site_name: 'Bwindi Impenetrable Forest',
      logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=200&q=80',
      location: 'Kanungu District, Uganda',
      verification_status: 'verified',
    },
    package_name: 'Batwa Cultural Immersion',
    description:
      'Spend a transformative day with the Batwa pygmies — the original forest people of Bwindi. Through storytelling, traditional medicine walks, honey harvesting, and music, you will gain deep insight into one of Africa\'s oldest indigenous cultures.',
    price: 120,
    duration: '1 Full Day',
    event_date: '2026-04-20',
    max_participants: 12,
    difficulty: 'Easy',
    includes: [
      'Batwa cultural guide',
      'Traditional lunch with the community',
      'Forest medicine walk',
      'Traditional music & dance session',
      'Community contribution fee',
    ],
    excludes: [
      'Transport to site',
      'Accommodation',
      'Personal expenses',
    ],
    media: [
      { id: 4, media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1080&q=85', media_type: 'image' },
      { id: 5, media_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1080&q=85', media_type: 'image' },
    ],
    schedule: [
      { time: '08:00 AM', activity: 'Welcome ceremony at village' },
      { time: '09:00 AM', activity: 'Forest medicine & honey walk' },
      { time: '11:00 AM', activity: 'Traditional storytelling session' },
      { time: '01:00 PM', activity: 'Communal lunch' },
      { time: '02:30 PM', activity: 'Music, dance & craft making' },
      { time: '04:30 PM', activity: 'Farewell & departure' },
    ],
    status: 'active',
    bookings_count: 89,
  },
  4: {
    id: 4,
    provider_id: 102,
    provider: {
      id: 102,
      site_name: 'Kazinga Cultural Village',
      logo_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
      location: 'Kabale, Western Uganda',
      verification_status: 'verified',
    },
    package_name: 'Bakiga Dance & Music Festival',
    description:
      'Immerse yourself in the vibrant traditions of the Bakiga people. This full-day festival brings together dancers, musicians, and storytellers from across the Kabale region for an authentic celebration of living culture.',
    price: 45,
    duration: '1 Full Day',
    event_date: '2026-05-10',
    max_participants: 50,
    difficulty: 'Easy',
    includes: [
      'Festival entry',
      'Cultural guide',
      'Traditional Bakiga meal',
      'Dance participation session',
      'Souvenir craft item',
    ],
    excludes: [
      'Transport',
      'Accommodation',
      'Extra food & drinks',
    ],
    media: [
      { id: 6, media_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1080&q=85', media_type: 'image' },
      { id: 7, media_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1080&q=85', media_type: 'image' },
    ],
    schedule: [
      { time: '09:00 AM', activity: 'Festival opening ceremony' },
      { time: '10:00 AM', activity: 'Traditional dance performances' },
      { time: '12:00 PM', activity: 'Communal Bakiga lunch' },
      { time: '02:00 PM', activity: 'Drumming & music workshop' },
      { time: '03:30 PM', activity: 'Craft market & storytelling' },
      { time: '05:00 PM', activity: 'Closing ceremony' },
    ],
    status: 'active',
    bookings_count: 201,
  },
};