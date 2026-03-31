import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { z } from 'zod'; //validate form
import { useForm } from 'react-hook-form'; //handle form events and form satate
import { zodResolver } from '@hookform/resolvers/zod'; //connect zod to react hook form
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router'; //redirect pages

const signUpSchema = z
  .object({
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 kí tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 kí tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'], //assign this error to the confirmPassword field
  });
//use type to extract the schema type and avoid re-defining the object elsewhere
type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { signUp } = useAuthStore(); //get the signUp method of the useAuthStore
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema), //connect useForm to signUpSchema
  });

  //handle form submission
  const onSubmit = async (data: SignUpFormValues) => {
    //get sign up data from the form
    const { username, email, password } = data;

    //call signUp at the authStore
    await signUp(username, email, password);

    //navigate to sign in page
    navigate('/signin');
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/*header-logo*/}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>

                <h1 className="!text-2xl font-bold">Tạo tài khoản Yourvocab</h1>

                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu
                </p>
              </div>

              {/*username*/}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="yourvocab"
                  {...register('username')}
                />

                {errors.username && (
                  <p className="text-destructive text-sm">{errors.username.message}</p>
                )}
              </div>

              {/*email*/}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="yourvocab@gmail.com"
                  {...register('email')}
                />

                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>

              {/*password*/}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Mật khẩu"
                  {...register('password')}
                />

                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              {/*confirm password*/}
              <div className="flex flex-col gap-3">
                <Label htmlFor="confirmPassword" className="block text-sm">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  {...register('confirmPassword')}
                />

                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/*signup button*/}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Tạo tài khoản
              </Button>

              <div className="text-center text-sm">
                Đã có tài khoản?{' '}
                <a href="/signin" className="underline underline-offset-4">
                  Đăng nhập
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
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{' '}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
};

export default SignUpForm;
