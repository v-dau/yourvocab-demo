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

const getSignInSchema = (t: TFunction) =>
  z.object({
    identifier: z
      .string()
      .min(3, t('auth.val_identifier', 'Vui lòng nhập tên đăng nhập hoặc email')),
    password: z.string().min(1, t('auth.val_password', 'Vui lòng nhập mật khẩu')),
  });

type SignInFormValues = z.infer<ReturnType<typeof getSignInSchema>>;

const SignInForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const signInSchema = useMemo(() => getSignInSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { identifier, password } = data;
    await signIn(identifier, password);
    navigate('/dashboard');
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>
                <h1 className="!text-2xl font-bold">
                  {t('auth.signin_title', 'Đăng nhập Yourvocab')}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {t('auth.signin_subtitle', 'Chào mừng bạn! Hãy đăng nhập để bắt đầu.')}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  {t('auth.username_or_email', 'Tên đăng nhập hoặc email')}
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="yourvocab"
                  {...register('identifier')}
                />
                {errors.identifier && (
                  <p className="text-destructive text-sm">{errors.identifier.message as string}</p>
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {t('common.signin', 'Đăng nhập')}
              </Button>

              <div className="text-center text-sm">
                {t('auth.no_account', 'Chưa có tài khoản?')}{' '}
                <a href="/signup" className="underline underline-offset-4">
                  {t('common.signup', 'Đăng ký')}
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.png"
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

export default SignInForm;
