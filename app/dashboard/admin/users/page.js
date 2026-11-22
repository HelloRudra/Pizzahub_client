'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ManageUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState(null);
  const [selected, setSelected] = useState(null);

  async function load() {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (role) q.set('role', role);
    try {
      const d = await apiFetch(`/api/admin/users?${q}`);
      setUsers(d.users);
    } catch (e) {
      toast.error(e.message);
      setUsers([]);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role]);

  async function toggleBlock(u) {
    try {
      const d = await apiFetch(`/api/admin/users/${u.id}/block`, { method: 'PATCH', body: { isBlocked: !u.isBlocked } });
      toast.success(d.message);
      setSelected(null);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input className="sm:col-span-2" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
          <option value="">All roles</option>
          <option value="vendor">Vendors</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {!users ? <p>Loading users...</p> : users.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center text-muted-foreground">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 text-left">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="space-x-2 p-3 whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => setSelected(u)}>Details</Button>
                    {u.role !== 'admin' && (
                      <Button size="sm" variant={u.isBlocked ? 'outline' : 'destructive'} onClick={() => toggleBlock(u)}>
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md space-y-2 rounded-xl bg-white p-6 text-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">{selected.name}</h2>
            <p>Email: {selected.email}</p>
            <p>Role: <span className="capitalize">{selected.role}</span></p>
            {selected.businessName && <p>Restaurant: {selected.businessName}</p>}
            <p>Plan: <span className="capitalize">{selected.subscriptionPlan}</span></p>
            {selected.subscriptionExpiresAt && <p>Plan expires: {new Date(selected.subscriptionExpiresAt).toLocaleDateString()}</p>}
            <p>Status: {selected.isBlocked ? 'Blocked' : 'Active'}</p>
            <p>Joined: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '-'}</p>
            <Button className="mt-2" variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}