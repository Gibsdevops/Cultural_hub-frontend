import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Fetch promotional slides from backend.
 * Endpoint: GET /admin/slides
 * Falls back to mock data if API is not ready.
 */
export const getPromotionalSlides = async () => {
  try {
    const response = await API.get('/admin/slides');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock slides:', error.message);
    // Mock data — replace with real API when backend is ready
    return MOCK_SLIDES;
  }
};

// ─── Mock Data (used until backend is connected) ────────────────────────────
const MOCK_SLIDES = [
  {
    id: 1,
    title: 'Discover Uganda\'s Ancient Kingdoms',
    description: 'Journey through centuries of royal heritage, vibrant traditions, and breathtaking landscapes that define the Pearl of Africa.',
    image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=90',
    cta: 'Explore Now',
  },
  {
    id: 2,
    title: 'Sacred Forests & Mountain Gorillas',
    description: 'Trek through mist-covered forests where nature and culture intertwine in extraordinary harmony.',
    image_url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=90',
    cta: 'Start Journey',
  },
  {
    id: 3,
    title: 'Living Traditions, Timeless Stories',
    description: 'Experience authentic cultural ceremonies, traditional music, and the warm hospitality of local communities.',
    image_url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=90',
    cta: 'Discover More',
  },
  {
    id: 4,
    title: 'Nile River — The Cradle of Civilizations',
    description: 'Follow the world\'s longest river through landscapes of unparalleled beauty and cultural significance.',
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=90',
    cta: 'Plan Your Trip',
  },
];