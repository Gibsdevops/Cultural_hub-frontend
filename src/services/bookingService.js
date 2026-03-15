import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Create a new booking
 * POST /bookings
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await API.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.warn('Booking API not ready, using mock');
    return {
      id: Math.floor(Math.random() * 10000),
      ...bookingData,
      booking_status: 'confirmed',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
    };
  }
};

/**
 * Get bookings for logged-in tourist
 * GET /bookings/user
 */
export const getUserBookings = async () => {
  try {
    const response = await API.get('/bookings/user');
    return response.data;
  } catch (error) {
    console.warn('Bookings API not ready, using mock');
    return MOCK_BOOKINGS;
  }
};

// ─── Mock Bookings Data ───────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    id: 5001,
    booking_ref: 'CT-5001',
    package: {
      id: 1,
      package_name: 'Gorilla Trekking Experience',
      duration: '1 Full Day',
      event_date: '2026-04-15',
      media_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
    },
    provider: {
      id: 101,
      site_name: 'Bwindi Impenetrable Forest',
      logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=100&q=80',
      location: 'Kanungu, Uganda',
    },
    participants: 2,
    total_price: 1470,
    booking_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'card',
    booking_date: '2026-03-01',
  },
  {
    id: 5002,
    booking_ref: 'CT-5002',
    package: {
      id: 2,
      package_name: 'Batwa Cultural Immersion',
      duration: '1 Full Day',
      event_date: '2026-04-20',
      media_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80',
    },
    provider: {
      id: 101,
      site_name: 'Bwindi Impenetrable Forest',
      logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=100&q=80',
      location: 'Kanungu, Uganda',
    },
    participants: 1,
    total_price: 126,
    booking_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'mobile',
    booking_date: '2026-03-05',
  },
  {
    id: 5003,
    booking_ref: 'CT-5003',
    package: {
      id: 4,
      package_name: 'Bakiga Dance & Music Festival',
      duration: '1 Full Day',
      event_date: '2025-11-10',
      media_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80',
    },
    provider: {
      id: 102,
      site_name: 'Kazinga Cultural Village',
      logo_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
      location: 'Kabale, Uganda',
    },
    participants: 3,
    total_price: 142,
    booking_status: 'completed',
    payment_status: 'paid',
    payment_method: 'cash',
    booking_date: '2025-10-20',
  },
  {
    id: 5004,
    booking_ref: 'CT-5004',
    package: {
      id: 1,
      package_name: 'Gorilla Trekking Experience',
      duration: '1 Full Day',
      event_date: '2025-08-22',
      media_url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80',
    },
    provider: {
      id: 101,
      site_name: 'Bwindi Impenetrable Forest',
      logo_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=100&q=80',
      location: 'Kanungu, Uganda',
    },
    participants: 1,
    total_price: 735,
    booking_status: 'completed',
    payment_status: 'paid',
    payment_method: 'card',
    booking_date: '2025-07-10',
  },
];