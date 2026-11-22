'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

const STATUS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-700',
};

export default function MyItemsPage() {
  const [items, setItems] = useState(null);

  async function load() {
    try {
      const d = await apiFetch('/api/menu-items/mine');
      setItems(d.items);
    } catch (e) {
      toast.error(e.message);
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(item) {
    try {
      const d = await apiFetch(`/api/menu-items/${item._id}/availability`, {
        method: 'PATCH',
        body: { active: item.status === 'inactive' },
      });
      toast.success(d.message);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function remove(id) {
    try {
      const d = await apiFetch(`/api/menu-items/${id}`, { method: 'DELETE' });
      toast.success(d.message);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  function confirmDelete(item) {
    toast(`Delete "${item.itemName}"?`, {
      action: { label: 'Delete', onClick: () => remove(item._id) },
    });
  }

  if (!items) return <p>Loading your menu items...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Menu Items</h1>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/dashboard/vendor/add">Add item</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center text-muted-foreground">
          You have not added any items yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="flex flex-col overflow-hidden rounded-lg border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.images?.[0]} alt={item.itemName} className="h-44 w-full object-cover" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{item.itemName}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="text-sm text-muted-foreground">{item.location}</p>
                <p className="font-bold text-red-600">${Number(item.price).toFixed(2)}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/vendor/items/${item._id}/edit`}>Edit</Link>
                  </Button>
                  {['approved', 'inactive'].includes(item.status) && (
                    <Button size="sm" variant="outline" onClick={() => toggle(item)}>
                      {item.status === 'inactive' ? 'Activate' : 'Deactivate'}
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => confirmDelete(item)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}