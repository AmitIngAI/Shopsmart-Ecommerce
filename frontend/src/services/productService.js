import api from './api';

const PRODUCT_API = '/products';

export const productService = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get(PRODUCT_API, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`${PRODUCT_API}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await api.get(`${PRODUCT_API}/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`${PRODUCT_API}/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get(`${PRODUCT_API}/featured`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`${PRODUCT_API}/${productId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add product review
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`${PRODUCT_API}/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};