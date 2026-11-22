'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ItemForm from '@/components/ItemForm';
import { apiFetch } from '@/lib/api';

export default function AddItemPage() {
  const router = useRouter();

  async function create(values) {
    const data = await apiFetch('/api/menu-items', { method: 'POST', body: values });
    toast.success(data.message);
    router.push('/dashboard/vendor/items');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Add Menu Item</h1>
      <ItemForm submitLabel="Submit for approval" onSubmit={create} />
    </div>
  );
}