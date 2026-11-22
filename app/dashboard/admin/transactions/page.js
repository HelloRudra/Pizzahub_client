'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function TransactionsPage() {
  const [list, setList] = useState(null);

  useEffect(() => {
    apiFetch('/api/admin/transactions')
      .then((d) => setList(d.transactions))
      .catch((e) => {
        toast.error(e.message);
        setList([]);
      });
  }, []);

  if (!list) return <p>Loading transactions...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      {list.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center text-muted-foreground">No transactions yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 text-left">
              <tr><th className="p-3">Vendor</th><th className="p-3">Plan</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Date</th></tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-3"><p className="font-medium">{t.vendor?.businessName || t.vendor?.name || '-'}</p><p className="text-xs text-muted-foreground">{t.vendor?.email}</p></td>
                  <td className="p-3 capitalize">{t.plan}</td>
                  <td className="p-3">{(t.amount).toFixed(2)} {String(t.currency).toUpperCase()}</td>
                  <td className="p-3 capitalize">{t.status}</td>
                  <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}