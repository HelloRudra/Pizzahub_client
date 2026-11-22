'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import OrderTimeline from '@/components/OrderTimeline';
import { Button } from '@/components/ui/button';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState(null);

  async function load() {
    try {
      const d = await apiFetch('/api/orders/mine');
      setOrders(d.orders);
    } catch (e) {
      toast.error(e.message);
      setOrders([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(id) {
    try {
      const d = await apiFetch(`/api/orders/${id}/cancel`, { method: 'PATCH' });
      toast.success(d.message);
    } catch (e) {
      toast.error(e.message);
    }
    load();
  }

  function confirmCancel(order) {
    toast(`Cancel your order for "${order.item?.itemName}"?`, {
      action: { label: 'Yes, cancel', onClick: () => cancel(order._id) },
    });
  }

  if (!orders) return <p>Loading your orders...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          <p className="text-muted-foreground">You have not placed any orders yet.</p>
          <Button asChild className="mt-4 bg-red-600 hover:bg-red-700">
            <Link href="/menu">Browse menu</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.item?.images?.[0]} alt="" className="h-32 w-full rounded-lg object-cover sm:w-40" />
              <div className="flex-1 space-y-1 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold">{o.item?.itemName || 'Item removed'}</h2>
                  <StatusBadge status={o.status} />
                </div>
                <div className="py-1">
                  <OrderTimeline status={o.status} />
                </div>
                <p>
                  <span className="text-muted-foreground">Restaurant:</span>{' '}
                  {o.vendor?.businessName || o.vendor?.name}
                </p>
                <p><span className="text-muted-foreground">Delivery date:</span> {o.deliveryDate}</p>
                <p><span className="text-muted-foreground">Address:</span> {o.deliveryAddress}</p>
                {o.message && (
                  <p><span className="text-muted-foreground">Message:</span> {o.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Requested on {new Date(o.createdAt).toLocaleString()}
                </p>
                {o.status === 'pending' && (
                  <Button size="sm" variant="destructive" className="mt-2" onClick={() => confirmCancel(o)}>
                    Cancel order
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}