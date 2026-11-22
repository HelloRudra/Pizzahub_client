'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useSession, signOut } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <p className="p-8">Loading...</p>;
  if (!session) return <Link href="/signin" className="block p-8">Please sign in</Link>;

  async function testServer() {
    try {
      const data = await apiFetch('/api/me');
      toast.success(`Server verified you as: ${data.user.role}`);
    } catch (err) {
      toast.error(`${err.status || ''} ${err.message}`);
    }
  }

  return (
    <div className="space-y-3 p-8">
      <h1 className="text-2xl font-bold">Hello, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={testServer}>Test server</Button>
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    </div>
  );
}