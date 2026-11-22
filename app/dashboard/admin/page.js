'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = { pending: 'bg-yellow-400', approved: 'bg-green-500', rejected: 'bg-red-500', inactive: 'bg-gray-400' };

export default function AdminOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch('/api/admin/stats').then(setData).catch(() => setData({ stats: {}, itemsByStatus: [] }));
  }, []);

  if (!data) return <p>Loading...</p>;
  const s = data.stats;
  const cards = [
    ['Total users', s.totalUsers],
    ['Vendors', s.vendors],
    ['Customers', s.customers],
    ['Menu items', s.totalItems],
    ['Pending items', s.pendingItems],
    ['Transactions', s.totalTransactions],
  ];
  const max = Math.max(1, ...data.itemsByStatus.map((i) => i.count));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold text-red-600">{value ?? 0}</CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Menu items by status</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.itemsByStatus.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
          {data.itemsByStatus.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-3 text-sm">
              <span className="w-20 capitalize">{status}</span>
              <div className="h-5 flex-1 rounded bg-gray-100">
                <div className={`h-5 rounded ${COLORS[status] || 'bg-gray-400'}`} style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <span className="w-8 text-right font-semibold">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}