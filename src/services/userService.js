import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Get current user profile
 * GET /users/profile
 */
export const getUserProfile = async () => {
  try {
    const response = await API.get('/users/profile');
    return response.data;
  } catch (error) {
    console.warn('API not ready, using mock profile');
    return MOCK_PROFILE;
  }
};

/**
 * Update user profile
 * PUT /users/profile
 */
export const updateUserProfile = async (data) => {
  try {
    const response = await API.put('/users/profile', data);
    return response.data;
  } catch (error) {
    console.warn('Update API not ready');
    return { ...MOCK_PROFILE, ...data };
  }
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROFILE = {
  id: 1,
  full_name: 'Alex Mugisha',
  email: 'alex.mugisha@email.com',
  phone: '+256 772 456 789',
  role: 'tourist',
  profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  location: 'Kampala, Uganda',
  joined_date: '2025-01-15',
  bookings_count: 4,
  saved_count: 12,
  following_count: 7,
};