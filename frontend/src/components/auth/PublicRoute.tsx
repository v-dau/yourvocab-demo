import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {
  const { accessToken } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    // Không tự động cấu hình lại token hoặc user ở route này
    // Tránh spam API refresh tới server khi user vừa truy cập trang Đăng Nhập / Đăng Ký
    setStarting(false);
  }, []);

  if (starting) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Nếu đã đăng nhập (có token hoặc user) thì chuyển hướng vào dashboard
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
