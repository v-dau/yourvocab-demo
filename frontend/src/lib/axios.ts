import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const api = axios.create({
  //nếu ở Local (máy tính) không có biến này, nó tự lấy localhost.
  //nếu trên Vercel, nó sẽ lấy cái link Render (backend api).
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, //gửi cookie kèm theo request vì lưu refresh token trong đó
});

//gắn access token vào req header mỗi khi người dùng gửi req
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  //interceptors là hàm JS thuần nên phải dùng getState() để lấy AT thay vì useAuthStore() (chỉ có react component mới được dùng được).

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

//tự động refresh token khi cần
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config; //config của request bị thất bại

    //trả về lỗi thẳng với những request này
    if (
      originalRequest.url.includes('/auth/signup') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (originalRequest.url.includes('/auth/signin')) {
      if (error.response?.status === 403 && error.response?.data?.code === 'USER_BANNED') {
        useAuthStore.getState().clearState();
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }

    //xử lý user bị ban
    if (error.response?.status === 403 && error.response?.data?.code === 'USER_BANNED') {
      useAuthStore.getState().clearState();

      const reason = error.response.data.details?.reason || '';
      const expiry = error.response.data.details?.expiry || '';

      if (!window.location.pathname.includes('/signin')) {
        window.location.href = `/signin?banned=true&reason=${encodeURIComponent(reason)}&expiry=${encodeURIComponent(expiry)}`;
      }
      return Promise.reject(error);
    }

    //giới hạn lượt gửi lại request là 4
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      console.log('refresh', originalRequest._retryCount);

      try {
        const res = await api.post('/auth/refresh', { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        //gắn AT mới vào header của request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); //gửi lại request với AT mới
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    //nếu không phải lỗi 403
    return Promise.reject(error);
  }
);

export default api;
