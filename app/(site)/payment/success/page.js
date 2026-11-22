'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [isPending, session, router]);

  // The page never activates Premium. It only checks what the webhook has already saved.
  useEffect(() => {
    if (!session) return;
    let tries = 0;
    const timer = setInterval(async () => {
      tries += 1;
      try {
        const d = await apiFetch('/api/me');
        if (d.user.subscriptionPlan === 'premium') {
          setPremium(true);
          clearInterval(timer);
        }
      } catch {}
      if (tries >= 10) clearInterval(timer);
    }, 2000);
    return () => clearInterval(timer);
  }, [session]);

  if (isPending || !session) return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-4 text-3xl font-extrabold">Payment received</h1>
      {premium ? (
        <p className="mt-2 text-muted-foreground">Your Premium plan is active. Enjoy unlimited menu items!</p>
      ) : (
        <p className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Confirming your payment with Stripe...
        </p>
      )}
      <Button asChild className="mt-6 bg-red-600 hover:bg-red-700">
        <Link href="/dashboard/vendor/subscription">Go to Subscription</Link>
      </Button>
    </div>
  );
}