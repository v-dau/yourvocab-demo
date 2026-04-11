import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {
  const { accessToken, user, refresh } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!accessToken) {
        try {
          await refresh(true); // refresh trang ngầm
        } catch {
          // bỏ qua nếu chưa đăng nhập
        }
      }
      setStarting(false);
    };

    initAuth();
  }, [accessToken, refresh]);

  if (starting) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Nếu đã đăng nhập thì điều hướng tùy theo role nếu cần, hoặc mặc định về dashboard tương ứng
  if (accessToken || user) {
    // Nếu là admin thì đưa về trang admin, ngược lại về page user
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
