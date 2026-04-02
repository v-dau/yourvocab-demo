import SignInForm from '@/components/auth/signin-form';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router';

export default function SignInPage() {
  const { accessToken } = useAuthStore();

  if (accessToken) {
    return (
      <Navigate
        to="/dashboard"
        replace //replace current route in browser history so users can't go back to the protected page
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-6 md:p-10 flex-1 bg-gradient-blue min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-sm md:max-w-4xl pt-8 pb-8 flex-1 flex flex-col justify-center">
        <SignInForm />
      </div>
    </div>
  );
}
