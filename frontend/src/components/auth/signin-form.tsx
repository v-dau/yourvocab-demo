import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { z } from 'zod'; //validate form
import { useForm } from 'react-hook-form'; //handle form events and form satate
import { zodResolver } from '@hookform/resolvers/zod'; //connect zod to react hook form
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router';

const signInSchema = z.object({
  //use identifier to represent both username and email
  //only basic length validation is applied; distinguishing between username and email is handled by the BE
  identifier: z.string().min(3, 'Vui lòng nhập tên đăng nhập hoặc email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

//use type to extract the schema type and avoid re-defining the object elsewhere
type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema), //connect useForm to signUpSchema
  });

  //handle form submission
  const onSubmit = async (data: SignInFormValues) => {
    //get sign in data from the form
    const { identifier, password } = data;

    //call signIn at the authStore
    await signIn(identifier, password);

    navigate('/dashboard');
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

                <h1 className="!text-2xl font-bold">Đăng nhập Yourvocab</h1>

                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng nhập để bắt đầu
                </p>
              </div>

              {/*username*/}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Tên đăng nhập hoặc email
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="yourvocab"
                  {...register('identifier')}
                />

                {errors.identifier && (
                  <p className="text-destructive text-sm">{errors.identifier.message}</p>
                )}
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

              {/*signin button*/}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Chưa có tài khoản?{' '}
                <a href="/signup" className="underline underline-offset-4">
                  Đăng ký
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
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{' '}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
};

export default SignInForm;
