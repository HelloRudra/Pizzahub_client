'use client';

import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <p className="p-8">Loading...</p>;
  if (!session) return <Link href="/signin" className="p-8 block">Please sign in</Link>;

  return (
    <div className="p-8 space-y-3">
      <h1 className="text-2xl font-bold">Hello, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
}