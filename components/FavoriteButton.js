'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function FavoriteButton({ itemId }) {
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch('/api/favorites')
      .then((d) => setFav(d.ids.includes(itemId)))
      .catch(() => {});
  }, [itemId]);

  async function toggle() {
    setBusy(true);
    try {
      const d = await apiFetch(`/api/favorites/${itemId}`, { method: 'POST' });
      setFav(d.favorited);
      toast.success(d.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-red-50"
    >
      <Heart className={`h-4 w-4 ${fav ? 'fill-red-600 text-red-600' : ''}`} />
      {fav ? 'Saved' : 'Add to favorites'}
    </button>
  );
}