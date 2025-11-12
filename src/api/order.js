import axiosInstance from './axiosInstance';

const api = axiosInstance({ prefix: '/api/orders' });
export const placeOrderWithCart = (payload) => api.post('/cart', payload);
export const getOrders = () => api.get('');

const adminApi = axiosInstance({ prefix: '/api/admin' });
export const getAllOrders = () => adminApi.get('/orders');