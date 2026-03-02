import api from './api';

const PRODUCT_API = '/products';

export const productService = {
  // Get all products - SILENT (no toast on error)
  getAllProducts: async () => {
    try {
      const response = await api.get(PRODUCT_API);
      return response.data;
    } catch (error) {
      // ❌ NO TOAST - just throw error silently
      console.log('📦 Backend not available, using local data');
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`${PRODUCT_API}/${id}`);
      return response.data;
    } catch (error) {
      console.log('📦 Product not found in backend');
      throw error;
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
      console.log('🔍 Search failed, using local search');
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`${PRODUCT_API}/category/${category}`);
      return response.data;
    } catch (error) {
      console.log('📂 Category fetch failed');
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get(`${PRODUCT_API}/featured`);
      return response.data;
    } catch (error) {
      console.log('⭐ Featured fetch failed');
      throw error;
    }
  },

  // Get deals
  getDeals: async () => {
    try {
      const response = await api.get(`${PRODUCT_API}/deals`);
      return response.data;
    } catch (error) {
      console.log('🔥 Deals fetch failed');
      throw error;
    }
  },

  // Get products by tag
  getProductsByTag: async (tag) => {
    try {
      const response = await api.get(`${PRODUCT_API}/tag/${tag}`);
      return response.data;
    } catch (error) {
      console.log('🏷️ Tag fetch failed');
      throw error;
    }
  }
};