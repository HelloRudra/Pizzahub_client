'use client';

import { useSession } from '@/lib/auth-client';

export default function CustomerOverview() {
  const { data: session } = useSession();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Customer Overview</h1>
      <p className="text-muted-foreground">Welcome, {session?.user?.name}. Order stats are coming soon.</p>
    </div>
  );
}