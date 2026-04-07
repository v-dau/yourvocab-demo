import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { accessToken, loading, refresh, fetchMe, user } = useAuthStore();
  const [starting, setStarting] = useState(true); //indicates the app is initializing

  useEffect(() => {
    const initAuth = async () => {
      try {
        //get the newest token from the store
        let currentToken = useAuthStore.getState().accessToken;

        if (!currentToken) {
          await refresh();
          currentToken = useAuthStore.getState().accessToken; //updates currentToken after refresh
        }

        //get the current user from the store
        const currentUser = useAuthStore.getState().user;

        if (currentToken && !currentUser) {
          await fetchMe();
        }
      } catch (error) {
        console.error('Authentication initialization error', error);
      } finally {
        setStarting(false);
      }
    };

    initAuth();
  }, [refresh, fetchMe]);

  if (starting || loading) {
    // if starting = true, show loading screen while app initializes
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/signin"
        replace //replace current route in browser history so users can't go back to the protected page
      />
    );
  }

  // RBAC routing
  if (requiredRole && user?.role && user.role !== requiredRole) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <Outlet></Outlet> //render child routes of ProtectedRoute
  );
};

export default ProtectedRoute;
