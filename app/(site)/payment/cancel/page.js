'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XCircle, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [isPending, session, router]);

  if (isPending || !session) return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <XCircle className="mx-auto h-16 w-16 text-red-600" />
      <h1 className="mt-4 text-3xl font-extrabold">Payment cancelled</h1>
      <p className="mt-2 text-muted-foreground">No charge was made. You can upgrade any time.</p>
      <Button asChild className="mt-6 bg-red-600 hover:bg-red-700">
        <Link href="/dashboard/vendor/subscription">Back to Subscription</Link>
      </Button>
    </div>
  );
}