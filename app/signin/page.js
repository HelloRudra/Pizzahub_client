'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient, signIn, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');

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

      // Check the real role from the database against the selected button
      const { data } = await authClient.getSession();
      const actualRole = data?.user?.role;

      if (actualRole !== 'admin' && actualRole !== role) {
        await signOut();
        toast.error(
          `This is a ${actualRole} account. Please choose "${
            actualRole === 'vendor' ? 'Vendor' : 'Customer'
          }" and try again.`
        );
        return;
      }

      toast.success('Welcome back!');
      window.location.href = '/dashboard';
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
          <CardDescription>Choose how you want to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                ['customer', 'Customer'],
                ['vendor', 'Vendor (Restaurant)'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    role === value
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'bg-white hover:bg-orange-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
              {loading ? 'Signing in...' : `Sign In as ${role === 'vendor' ? 'Vendor' : 'Customer'}`}
            </Button>

            {role === 'customer' && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn.social({ provider: 'google', callbackURL: '/dashboard' })}
              >
                Continue with Google
              </Button>
            )}

            <p className="text-center text-sm">
              New here?{' '}
              <Link href="/signup" className="font-medium text-red-600 hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}