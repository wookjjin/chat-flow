import axios from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    meta?: {
      timeout?: number;
    };
  }
}

const baseURL = import.meta.env.VITE_API_SERVER_URL || '';

const instance = axios.create({
  baseURL,
  meta: {
    timeout: 5000,
  },
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return error;
  },
);

instance.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default instance;
