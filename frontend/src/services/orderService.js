import api from './api';

const ORDER_API = '/orders';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post(ORDER_API, {
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        totalAmount: orderData.totalAmount
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all user orders
  getUserOrders: async () => {
    try {
      const response = await api.get(`${ORDER_API}/my-orders`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`${ORDER_API}/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`${ORDER_API}/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Track order
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`${ORDER_API}/${orderId}/track`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get order status
  getOrderStatus: async (orderId) => {
    try {
      const response = await api.get(`${ORDER_API}/${orderId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};