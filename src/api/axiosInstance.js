import axios from 'axios';

export default function axiosInstance({ prefix = '' } = {}) {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + prefix,
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
}