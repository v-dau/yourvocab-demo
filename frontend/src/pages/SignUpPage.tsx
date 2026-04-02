import SignUpForm from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-6 md:p-10 flex-1 bg-gradient-blue min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-sm md:max-w-4xl pt-8 pb-8 flex-1 flex flex-col justify-center">
        <SignUpForm />
      </div>
    </div>
  );
}
