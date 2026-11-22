'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fieldClass =
  'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-400';

export default function OrderForm({ itemId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const data = await apiFetch('/api/orders', {
        method: 'POST',
        body: {
          itemId,
          deliveryDate: form.get('deliveryDate'),
          deliveryAddress: form.get('deliveryAddress'),
          message: form.get('message'),
        },
      });
      toast.success(data.message);
      router.push('/dashboard/customer/orders');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-orange-50/60 p-5">
      <h3 className="text-lg font-semibold">Place your order</h3>
      <div className="space-y-2">
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <Input id="deliveryDate" name="deliveryDate" type="date" min={today} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Delivery Address</Label>
        <textarea id="deliveryAddress" name="deliveryAddress" rows={2} required className={fieldClass} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Additional Message / Special Instructions</Label>
        <textarea id="message" name="message" rows={2} maxLength={500} className={fieldClass} />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
        {loading ? 'Placing order...' : 'Place Order'}
      </Button>
    </form>
  );
}