import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

/**
 * Login user
 * POST /auth/login
 */
export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed. Please try again.' };
  }
};

/**
 * Register new user
 * POST /auth/register
 */
export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed. Please try again.' };
  }
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async () => {
  try {
    await API.post('/auth/logout');
  } catch (error) {
    console.warn('Logout error:', error.message);
  } finally {
    localStorage.removeItem('ct_token');
    localStorage.removeItem('ct_user');
  }
};

/**
 * Save auth token to localStorage
 */
export const saveToken = (token, user) => {
  localStorage.setItem('ct_token', token);
  localStorage.setItem('ct_user', JSON.stringify(user));
};

/**
 * Get saved auth token
 */
export const getToken = () => localStorage.getItem('ct_token');

/**
 * Get saved user
 */
export const getSavedUser = () => {
  const user = localStorage.getItem('ct_user');
  return user ? JSON.parse(user) : null;
};