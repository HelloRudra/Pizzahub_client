'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomerOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch('/api/orders/stats')
      .then((d) => setStats(d.stats))
      .catch(() => setStats({ total: 0, pending: 0, accepted: 0, rejected: 0 }));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    ['Total orders', stats.total],
    ['Pending', stats.pending],
    ['Accepted', stats.accepted],
    ['Rejected', stats.rejected],
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
    </div>
  );
}