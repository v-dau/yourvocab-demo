import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {
  const { accessToken, user } = useAuthStore();

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
