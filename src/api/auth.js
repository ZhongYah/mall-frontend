import axiosInstance from './axiosInstance';

const api = axiosInstance({ prefix: '/api/auth' });

export const login = payload => api.post('/login', payload);
export const register = payload => api.post('/register', payload);