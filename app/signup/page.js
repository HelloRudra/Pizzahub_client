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

const passwordOk = (p) => p.length >= 6 && /[A-Z]/.test(p) && /[a-z]/.test(p);

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name').trim();
    const email = form.get('email').trim();
    const password = form.get('password');
    const businessName = (form.get('businessName') || '').trim();
    const imageFile = form.get('image');

    if (!name) return toast.error('Full name is required');
    if (!passwordOk(password)) {
      return toast.error('Password needs 6+ characters, one uppercase and one lowercase letter');
    }
    if (role === 'vendor' && !businessName) {
      return toast.error('Restaurant name is required for vendors');
    }

    setLoading(true);
    try {
      let image;
      if (imageFile && imageFile.size > 0) {
        const upload = new FormData();
        upload.append('image', imageFile);
        const res = await fetch('/api/upload', { method: 'POST', body: upload });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Image upload failed');
        image = data.url;
      }

      const { error } = await signUp.email({
        name,
        email,
        password,
        image,
        role,
        businessName: role === 'vendor' ? businessName : undefined,
      });

      if (error) {
        toast.error(error.message || 'Sign up failed');
        return;
      }
      toast.success('Account created!');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join PizzaHub as a customer or a restaurant owner</CardDescription>
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>

            {role === 'vendor' && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Restaurant Name</Label>
                <Input id="businessName" name="businessName" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              <p className="text-xs text-muted-foreground">
                At least 6 characters with one uppercase and one lowercase letter.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image (optional)</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-red-600 hover:underline">
                Sign In
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