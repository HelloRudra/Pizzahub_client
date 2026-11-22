'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export default function DashboardIndex() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (role) {
      router.replace(`/dashboard/${['vendor', 'customer', 'admin'].includes(role) ? role : 'customer'}`);
    }
  }, [role, router]);

  return <p className="text-sm text-muted-foreground">Redirecting...</p>;
}