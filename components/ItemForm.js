'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CATEGORIES } from '@/lib/constants';

const fieldClass =
  'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-400';

export default function ItemForm({ initial, submitLabel, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const existingImages = initial?.images || [];

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const files = form.getAll('images').filter((f) => f && f.size > 0);

    if (files.length === 0 && existingImages.length === 0) {
      return toast.error('Please upload at least one image');
    }
    if (files.length > 4) return toast.error('Maximum 4 images allowed');

    setLoading(true);
    try {
      let images = existingImages;
      if (files.length > 0) {
        images = [];
        for (const file of files) {
          const upload = new FormData();
          upload.append('image', file);
          const res = await fetch('/api/upload', { method: 'POST', body: upload });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Image upload failed');
          images.push(data.url);
        }
      }

      await onSubmit({
        itemName: form.get('itemName'),
        category: form.get('category'),
        description: form.get('description'),
        price: form.get('price'),
        location: form.get('location'),
        images,
      });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-lg border bg-white p-6">
      <div className="space-y-2">
        <Label htmlFor="itemName">Item Name</Label>
        <Input id="itemName" name="itemName" defaultValue={initial?.itemName} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" name="category" defaultValue={initial?.category || ''} required className={fieldClass}>
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0.01" defaultValue={initial?.price} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (area / city)</Label>
        <Input id="location" name="location" defaultValue={initial?.location} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea id="description" name="description" rows={4} defaultValue={initial?.description} required className={fieldClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Item Images (up to 4)</Label>
        <Input id="images" name="images" type="file" accept="image/*" multiple />
        {existingImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Current images are kept unless you choose new files, which replace them.
            </p>
            <div className="flex gap-2">
              {existingImages.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="h-16 w-16 rounded object-cover" />
              ))}
            </div>
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}