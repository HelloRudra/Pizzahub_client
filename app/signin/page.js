'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUp, signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const { error } = await signIn.email({
        email: form.get('email').trim(),
        password: form.get('password'),
      });
      if (error) {
        toast.error(error.message || 'Invalid email or password');
        return;
      }
      toast.success('Welcome back!');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to PizzaHub</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-center text-sm">
              New here?{' '}
              <Link href="/signup" className="font-medium text-red-600 hover:underline">
                Create an account
              </Link>
            </p>
            <Button
  type="button"
  variant="outline"
  className="w-full"
  onClick={() => signIn.social({ provider: 'google', callbackURL: '/dashboard' })}
>
  Continue with Google
</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}