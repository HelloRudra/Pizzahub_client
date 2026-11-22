'use client';

import { useSession } from '@/lib/auth-client';

export default function AdminOverview() {
  const { data: session } = useSession();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      <p className="text-muted-foreground">Welcome, {session?.user?.name}. Platform stats are coming soon.</p>
    </div>
  );
}