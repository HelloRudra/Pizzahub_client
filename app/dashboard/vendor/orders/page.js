'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(null);

  async function load() {
    try {
      const d = await apiFetch('/api/orders/vendor');
      setOrders(d.orders);
    } catch (e) {
      toast.error(e.message);
      setOrders([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id, status) {
    try {
      const d = await apiFetch(`/api/orders/${id}/status`, { method: 'PATCH', body: { status } });
      toast.success(d.message);
    } catch (e) {
      toast.error(e.message);
    }
    load();
  }

  if (!orders) return <p>Loading orders...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customer Orders</h1>
      {orders.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center text-muted-foreground">
          No orders yet.
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
                <p><span className="text-muted-foreground">Customer:</span> {o.customer?.name} ({o.customer?.email})</p>
                <p><span className="text-muted-foreground">Delivery date:</span> {o.deliveryDate}</p>
                <p><span className="text-muted-foreground">Address:</span> {o.deliveryAddress}</p>
                {o.message && <p><span className="text-muted-foreground">Message:</span> {o.message}</p>}
                <p className="text-xs text-muted-foreground">Requested on {new Date(o.createdAt).toLocaleString()}</p>
                {o.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => decide(o._id, 'accepted')}>
                      Accept
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => decide(o._id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}