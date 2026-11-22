'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ItemForm from '@/components/ItemForm';
import { apiFetch } from '@/lib/api';

export default function EditItemPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/menu-items/mine/${id}`)
      .then((d) => setItem(d.item))
      .catch((e) => setError(e.message));
  }, [id]);

  async function update(values) {
    const data = await apiFetch(`/api/menu-items/${id}`, { method: 'PATCH', body: values });
    toast.success(data.message);
    router.push('/dashboard/vendor/items');
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!item) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Menu Item</h1>
      <ItemForm initial={item} submitLabel="Save changes" onSubmit={update} />
    </div>
  );
}