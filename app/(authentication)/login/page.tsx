'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof schema>;

function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Login successful! Redirecting to dashboard...');
      console.log('Login successful:', data);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    },
    onError: (error) => {
      toast.error('Login failed! Please check your credentials.');
      console.error('Login error:', error);
    },
  });

  const onsubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register('email')} id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input {...register('password')} id="password" type="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button disabled={mutation.isPending} type="submit" className="w-full">
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default Page;
