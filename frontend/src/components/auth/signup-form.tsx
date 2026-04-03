import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

const getSignUpSchema = (t: TFunction) =>
  z
    .object({
      username: z
        .string()
        .min(3, t('auth.val_username_min', 'Tên đăng nhập phải có ít nhất 3 kí tự')),
      email: z.string().email(t('auth.val_email_invalid', 'Email không hợp lệ')),
      password: z.string().min(8, t('auth.val_password_min', 'Mật khẩu phải có ít nhất 8 kí tự')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.val_password_match', 'Mật khẩu xác nhận không khớp'),
      path: ['confirmPassword'],
    });

type SignUpFormValues = z.infer<ReturnType<typeof getSignUpSchema>>;

const SignUpForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const signUpSchema = useMemo(() => getSignUpSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { username, email, password } = data;
    await signUp(username, email, password);
    navigate('/signin');
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" className="w-8" />
                </a>
                <h1 className="!text-2xl font-bold">
                  {t('auth.signup_title', 'Tạo tài khoản Yourvocab')}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {t('auth.signup_subtitle', 'Chào mừng bạn! Hãy đăng ký để bắt đầu.')}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  {t('auth.username', 'Tên đăng nhập')}
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="yourvocab"
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">{errors.username.message as string}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm">
                  {t('auth.email', 'Email')}
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="yourvocab@gmail.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message as string}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  {t('auth.password', 'Mật khẩu')}
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder={t('auth.password', 'Mật khẩu')}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message as string}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="confirmPassword" className="block text-sm">
                  {t('auth.confirm_password', 'Xác nhận mật khẩu')}
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder={t('auth.confirm_password', 'Xác nhận mật khẩu')}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">
                    {errors.confirmPassword.message as string}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {t('common.signup', 'Tạo tài khoản')}
              </Button>

              <div className="text-center text-sm">
                {t('auth.have_account', 'Đã có tài khoản?')}{' '}
                <a href="/signin" className="underline underline-offset-4">
                  {t('common.signin', 'Đăng nhập')}
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute inset-0 top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        {t('auth.terms_agreement', 'Bằng cách tiếp tục, bạn đồng ý với')}{' '}
        <a href="#">{t('auth.terms_of_service', 'Điều khoản dịch vụ')}</a> {t('auth.and', 'và')}{' '}
        <a href="#">{t('auth.privacy_policy', 'Chính sách bảo mật')}</a>{' '}
        {t('auth.of_us', 'của chúng tôi.')}
      </div>
    </div>
  );
};

export default SignUpForm;
