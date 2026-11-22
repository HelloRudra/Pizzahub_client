'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VendorOverview() {
  const { data: session } = useSession();
  const [items, setItems] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([apiFetch('/api/menu-items/mine'), apiFetch('/api/orders/stats')])
      .then(([i, o]) => {
        setItems(i.items);
        setStats(o.stats);
      })
      .catch(() => {
        setItems([]);
        setStats({ pending: 0, accepted: 0 });
      });
  }, []);

  if (!items || !stats) return <p>Loading...</p>;

  const cards = [
    ['Total menu items', items.length],
    ['Active menu items', items.filter((i) => i.status === 'approved').length],
    ['Pending orders', stats.pending],
    ['Accepted orders', stats.accepted],
    ['Current plan', (session?.user?.subscriptionPlan || 'free').toUpperCase()],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendor Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-red-600">{value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}