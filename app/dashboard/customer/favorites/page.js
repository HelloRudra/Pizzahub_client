'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import ItemCard from '@/components/ItemCard';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const [items, setItems] = useState(null);

  async function load() {
    try {
      const d = await apiFetch('/api/favorites');
      setItems(d.items);
    } catch (e) {
      toast.error(e.message);
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    try {
      const d = await apiFetch(`/api/favorites/${id}`, { method: 'POST' });
      toast.success(d.message);
    } catch (e) {
      toast.error(e.message);
    }
    load();
  }

  if (!items) return <p>Loading favorites...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Favorites</h1>
      {items.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          <p className="text-muted-foreground">No favorites yet.</p>
          <Button asChild className="mt-4 bg-red-600 hover:bg-red-700">
            <Link href="/menu">Browse menu</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="space-y-2">
              <ItemCard item={item} />
              <Button variant="outline" size="sm" className="w-full" onClick={() => remove(item._id)}>
                Remove from favorites
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}