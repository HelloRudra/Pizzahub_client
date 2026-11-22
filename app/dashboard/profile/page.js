'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const user = session?.user;
  if (!user) return <p>Loading...</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name').trim();
    const file = form.get('image');
    if (!name) return toast.error('Name is required');

    setLoading(true);
    try {
      let image = user.image;
      if (file && file.size > 0) {
        const upload = new FormData();
        upload.append('image', file);
        const res = await fetch('/api/upload', { method: 'POST', body: upload });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Image upload failed');
        image = data.url;
      }
      // role and subscription are never sent, and the auth hook strips them anyway
      const payload = { name, image };
      if (user.role === 'vendor') payload.businessName = form.get('businessName').trim();
      const { error } = await authClient.updateUser(payload);
      if (error) throw new Error(error.message);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-lg border bg-white p-6">
        {user.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-20 w-20 rounded-full object-cover" />
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user.email} disabled />
        </div>
        {user.role === 'vendor' && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Restaurant Name</Label>
            <Input id="businessName" name="businessName" defaultValue={user.businessName || ''} />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image (optional)</Label>
          <Input id="image" name="image" type="file" accept="image/*" />
        </div>
        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
          {loading ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}