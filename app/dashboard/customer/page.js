'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import StatusBars from '@/components/StatusBars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomerOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch('/api/orders/stats')
      .then((d) => setStats(d.stats))
      .catch(() => setStats({ total: 0, pending: 0, accepted: 0, rejected: 0, cancelled: 0 }));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    ['Total orders', stats.total || 0],
    ['Pending', stats.pending || 0],
    ['Accepted', stats.accepted || 0],
    ['Rejected', stats.rejected || 0],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-red-600">{value}</CardContent>
          </Card>
        ))}
      </div>
      <div className="max-w-xl">
        <StatusBars
          title="My orders by status"
          rows={[
            ['pending', stats.pending || 0, 'bg-yellow-400'],
            ['accepted', stats.accepted || 0, 'bg-green-500'],
            ['rejected', stats.rejected || 0, 'bg-red-500'],
            ['cancelled', stats.cancelled || 0, 'bg-gray-400'],
          ]}
        />
      </div>
    </div>
  );
}