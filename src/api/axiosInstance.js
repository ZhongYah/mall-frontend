import axios from 'axios';
import i18n from '../i18n';

export default function axiosInstance({ prefix = '' } = {}) {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + prefix,
    headers: { 'Content-Type': 'application/json' },
  });

  // === 請求攔截 ===
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // === 回應攔截 ===
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // 清除登入資訊
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        alert(i18n.t('login_expired_message'));

        // 強制跳轉登入頁
        window.location.href = '/login';
      }

      // 繼續將錯誤往外丟
      return Promise.reject(error);
    }
  );

  return api;
}