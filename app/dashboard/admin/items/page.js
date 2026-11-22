'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const STATUS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-700',
};

export default function ManageItemsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState(null);

  async function load() {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (status) q.set('status', status);
    try {
      const d = await apiFetch(`/api/menu-items/admin/all?${q}`);
      setItems(d.items);
    } catch (e) {
      toast.error(e.message);
      setItems([]);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  async function setItemStatus(id, next) {
    try {
      const d = await apiFetch(`/api/menu-items/admin/${id}/status`, { method: 'PATCH', body: { status: next } });
      toast.success(d.message);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function remove(id) {
    try {
      const d = await apiFetch(`/api/menu-items/admin/${id}`, { method: 'DELETE' });
      toast.success(d.message);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Menu Items</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input className="sm:col-span-2" placeholder="Search by item name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {!items ? <p>Loading items...</p> : items.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center text-muted-foreground">No items found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 text-left">
              <tr><th className="p-3">Item</th><th className="p-3">Vendor</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i._id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.images?.[0]} alt="" className="h-12 w-12 rounded object-cover" />
                      <div><p className="font-medium">{i.itemName}</p><p className="text-xs text-muted-foreground">{i.category}</p></div>
                    </div>
                  </td>
                  <td className="p-3">{i.vendor?.businessName || i.vendor?.name || '-'}</td>
                  <td className="p-3">${Number(i.price).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS[i.status]}`}>{i.status}</span>
                  </td>
                  <td className="space-x-2 p-3 whitespace-nowrap">
                    {i.status !== 'approved' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setItemStatus(i._id, 'approved')}>Approve</Button>
                    )}
                    {i.status !== 'rejected' && (
                      <Button size="sm" variant="outline" onClick={() => setItemStatus(i._id, 'rejected')}>Reject</Button>
                    )}
                    {i.status === 'approved' && (
                      <Button size="sm" variant="outline" onClick={() => setItemStatus(i._id, 'inactive')}>Deactivate</Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => toast(`Delete "${i.itemName}"?`, { action: { label: 'Delete', onClick: () => remove(i._id) } })}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}