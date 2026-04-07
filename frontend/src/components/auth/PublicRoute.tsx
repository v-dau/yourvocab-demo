import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {
  const { accessToken, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        let currentToken = useAuthStore.getState().accessToken;

        if (!currentToken) {
          try {
            await refresh(true);
          } catch {
            // Ignore error
          }
          currentToken = useAuthStore.getState().accessToken;
        }

        const currentUser = useAuthStore.getState().user;
        if (currentToken && !currentUser) {
          try {
            await fetchMe(true);
          } catch {
            // Ignore error
          }
        }
      } catch (error) {
        console.error('Auth initialization error', error);
      } finally {
        setStarting(false);
      }
    };
    initAuth();
  }, [refresh, fetchMe, accessToken]);

  if (starting || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Nếu đã đăng nhập (có token hoặc user) thì chuyển hướng vào dashboard
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
