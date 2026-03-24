import SignInForm from '@/components/auth/signin-form';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router';

export default function SignInPage() {
  const { accessToken, user, loading } = useAuthStore();

  if (accessToken) {
    return (
      <Navigate
        to="/dashboard"
        replace //replace current route in browser history so users can't go back to the protected page
      />
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-blue">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInForm />
      </div>
    </div>
  );
}
