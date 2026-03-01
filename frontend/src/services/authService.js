import api from './api';

const AUTH_API = '/users';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      console.log('📝 Registering user:', userData);
      
      const response = await api.post(`${AUTH_API}/register`, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        phone: userData.phone
      });
      
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('🔐 Logging in user:', credentials.email);
      
      const response = await api.post(`${AUTH_API}/login`, {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('✅ Login response:', response.data);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`${AUTH_API}/${id}`);
      return response.data.user;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },

  // Test API connection
  testConnection: async () => {
    try {
      const response = await api.get(`${AUTH_API}/test`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  }
};