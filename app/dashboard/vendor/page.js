'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import StatusBars from '@/components/StatusBars';
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
        setStats({ pending: 0, accepted: 0, rejected: 0, cancelled: 0 });
      });
  }, []);

  if (!items || !stats) return <p>Loading...</p>;

  const count = (s) => items.filter((i) => i.status === s).length;

  const cards = [
    ['Total menu items', items.length],
    ['Active menu items', count('approved')],
    ['Pending orders', stats.pending || 0],
    ['Accepted orders', stats.accepted || 0],
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
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusBars
          title="Orders by status"
          rows={[
            ['pending', stats.pending || 0, 'bg-yellow-400'],
            ['accepted', stats.accepted || 0, 'bg-green-500'],
            ['rejected', stats.rejected || 0, 'bg-red-500'],
            ['cancelled', stats.cancelled || 0, 'bg-gray-400'],
          ]}
        />
        <StatusBars
          title="Menu items by status"
          rows={[
            ['pending', count('pending'), 'bg-yellow-400'],
            ['approved', count('approved'), 'bg-green-500'],
            ['rejected', count('rejected'), 'bg-red-500'],
            ['inactive', count('inactive'), 'bg-gray-400'],
          ]}
        />
      </div>
    </div>
  );
}