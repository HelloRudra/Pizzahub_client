'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VendorOverview() {
  const { data: session } = useSession();
  const [items, setItems] = useState(null);

  useEffect(() => {
    apiFetch('/api/menu-items/mine')
      .then((d) => setItems(d.items))
      .catch(() => setItems([]));
  }, []);

  if (!items) return <p>Loading...</p>;

  const stats = [
    ['Total menu items', items.length],
    ['Active menu items', items.filter((i) => i.status === 'approved').length],
    ['Pending approval', items.filter((i) => i.status === 'pending').length],
    ['Current plan', (session?.user?.subscriptionPlan || 'free').toUpperCase()],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendor Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
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