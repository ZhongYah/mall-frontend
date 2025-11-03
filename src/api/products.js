import axiosInstance from './axiosInstance';

const api = axiosInstance({ prefix: '/api/products' });

export const getProducts = (params) => api.get('/search', { params });
