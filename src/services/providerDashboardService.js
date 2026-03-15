import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Get provider dashboard stats
 * GET /provider/dashboard
 */
export const getDashboardStats = async () => {
  try {
    const response = await API.get('/provider/dashboard');
    return response.data;
  } catch (error) {
    console.warn('API not ready, using mock dashboard');
    return MOCK_DASHBOARD;
  }
};

/**
 * Get provider bookings
 * GET /bookings/provider
 */
export const getProviderBookings = async () => {
  try {
    const response = await API.get('/bookings/provider');
    return response.data;
  } catch (error) {
    return MOCK_PROVIDER_BOOKINGS;
  }
};

/**
 * Upload a new experience post
 * POST /experiences
 */
export const uploadExperience = async (formData) => {
  try {
    const response = await API.post('/experiences', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.warn('Upload API not ready, using mock');
    return { id: Math.floor(Math.random() * 1000), ...formData, created_at: new Date().toISOString() };
  }
};

/**
 * Create a new package
 * POST /packages
 */
export const createPackage = async (packageData) => {
  try {
    const response = await API.post('/packages', packageData);
    return response.data;
  } catch (error) {
    console.warn('Package API not ready, using mock');
    return { id: Math.floor(Math.random() * 1000), ...packageData };
  }
};

/**
 * Update existing package
 * PUT /packages/:id
 */
export const updatePackage = async (id, packageData) => {
  try {
    const response = await API.put(`/packages/${id}`, packageData);
    return response.data;
  } catch (error) {
    return { id, ...packageData };
  }
};

/**
 * Delete a package
 * DELETE /packages/:id
 */
export const deletePackage = async (id) => {
  try {
    await API.delete(`/packages/${id}`);
    return true;
  } catch (error) {
    return true; // mock success
  }
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DASHBOARD = {
  provider: {
    id: 101,
    site_name: 'Bwindi Impenetrable Forest',
    logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=200&q=80',
    location: 'Kanungu, Uganda',
    verification_status: 'verified',
  },
  stats: {
    total_posts: 47,
    total_packages: 6,
    total_bookings: 143,
    total_revenue: 98450,
    this_month_bookings: 12,
    this_month_revenue: 8400,
  },
  recent_bookings: [
    {
      id: 6001,
      tourist_name: 'Sarah K.',
      tourist_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      package_name: 'Gorilla Trekking Experience',
      booking_date: '2026-03-12',
      participants: 2,
      total_price: 1470,
      booking_status: 'confirmed',
    },
    {
      id: 6002,
      tourist_name: 'James M.',
      tourist_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      package_name: 'Batwa Cultural Immersion',
      booking_date: '2026-03-11',
      participants: 1,
      total_price: 126,
      booking_status: 'confirmed',
    },
    {
      id: 6003,
      tourist_name: 'Emma L.',
      tourist_image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
      package_name: 'Gorilla Trekking Experience',
      booking_date: '2026-03-10',
      participants: 3,
      total_price: 2205,
      booking_status: 'confirmed',
    },
    {
      id: 6004,
      tourist_name: 'David O.',
      tourist_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
      package_name: 'Batwa Cultural Immersion',
      booking_date: '2026-03-09',
      participants: 4,
      total_price: 504,
      booking_status: 'pending',
    },
  ],
  packages: [
    {
      id: 1,
      package_name: 'Gorilla Trekking Experience',
      price: 700,
      duration: '1 Full Day',
      event_date: '2026-04-15',
      media_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
      status: 'active',
      bookings_count: 89,
    },
    {
      id: 2,
      package_name: 'Batwa Cultural Immersion',
      price: 120,
      duration: '1 Full Day',
      event_date: '2026-04-20',
      media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80',
      status: 'active',
      bookings_count: 54,
    },
    {
      id: 3,
      package_name: 'Forest Birds & Nature Walk',
      price: 85,
      duration: '4 Hours',
      event_date: '2025-09-28',
      media_url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80',
      status: 'past',
      bookings_count: 31,
    },
  ],
};

const MOCK_PROVIDER_BOOKINGS = MOCK_DASHBOARD.recent_bookings;