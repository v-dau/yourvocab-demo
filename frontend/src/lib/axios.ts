import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const api = axios.create({
  //use localhost in development; use same domain with the backend in production
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000/api' : '/api',
  withCredentials: true,
});

//assign the access token to req header everytime user send a req
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  //interceptors are normal JS functions, so we CANNOT use useAuthStore() (which requires a React component).
  //use getState(): Retrieves the token only at the moment this code executes.
  //it doesn't subscribe to store updates, so the value remains static even if the store changes later.

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

//automatically call the refresh api when the access token expires
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config; //config of the failed request

    //the apis don't need to check
    if (
      originalRequest.url.includes('/auth/signin') ||
      originalRequest.url.includes('/auth/signup') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    // Intercept banned user check (only for protected routes)
    if (error.response?.status === 403 && error.response?.data?.code === 'USER_BANNED') {
      useAuthStore.getState().clearState();

      const reason = error.response.data.details?.reason || '';
      const expiry = error.response.data.details?.expiry || '';

      if (!window.location.pathname.includes('/signin')) {
        window.location.href = `/signin?banned=true&reason=${encodeURIComponent(reason)}&expiry=${encodeURIComponent(expiry)}`;
      }
      return Promise.reject(error);
    }

    //limit the retry time to 4
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      console.log('refresh', originalRequest._retryCount);

      try {
        const res = await api.post('/auth/refresh', { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        //attach new access token to the header of the old request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); //resend the request
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    //if not 403
    return Promise.reject(error);
  }
);

export default api;
