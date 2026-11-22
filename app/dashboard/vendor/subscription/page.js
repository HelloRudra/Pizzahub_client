'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, Crown } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

const FREE = ['Max 3 active menu items', 'Basic vendor dashboard', 'Order management'];
const PREMIUM = ['Unlimited active items', 'Premium vendor badge', 'Featured menu placement', 'All Free features'];

export default function SubscriptionPage() {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch('/api/me').then((d) => setUser(d.user)).catch((e) => toast.error(e.message));
  }, []);

  async function upgrade() {
    setBusy(true);
    try {
      const d = await apiFetch('/api/payments/checkout', { method: 'POST' });
      window.location.href = d.url;
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      const d = await apiFetch('/api/payments/cancel', { method: 'POST' });
      toast.success(d.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!user) return <p>Loading...</p>;
  const premium =
    user.subscriptionPlan === 'premium' &&
    (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > new Date());

  const Plan = ({ title, price, features, current, children }) => (
    <div className={`flex flex-col rounded-xl border bg-white p-6 ${current ? 'border-red-600 ring-2 ring-red-100' : ''}`}>
      <h2 className="flex items-center gap-2 text-xl font-bold">
        {title === 'Premium' && <Crown className="h-5 w-5 text-yellow-500" />} {title}
        {current && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Current plan</span>}
      </h2>
      <p className="mt-2 text-3xl font-extrabold">{price}</p>
      <ul className="my-4 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> {f}</li>
        ))}
      </ul>
      <div className="mt-auto">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscription</h1>
      {premium && user.subscriptionExpiresAt && (
        <p className="text-sm text-muted-foreground">
          Premium is active until {new Date(user.subscriptionExpiresAt).toLocaleDateString()}.
        </p>
      )}
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        <Plan title="Free" price="$0" features={FREE} current={!premium} />
        <Plan title="Premium" price="$10 / month" features={PREMIUM} current={premium}>
          {premium ? (
            <Button variant="outline" disabled={busy} onClick={cancel} className="w-full">Cancel subscription</Button>
          ) : (
            <Button disabled={busy} onClick={upgrade} className="w-full bg-red-600 hover:bg-red-700">
              {busy ? 'Redirecting to Stripe...' : 'Upgrade to Premium'}
            </Button>
          )}
        </Plan>
      </div>
    </div>
  );
}