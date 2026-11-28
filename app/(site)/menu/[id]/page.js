'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Store, Crown, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import OrderForm from '@/components/OrderForm';
import FavoriteButton from '@/components/FavoriteButton';
import { Button } from '@/components/ui/button';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Private page: wait for the session to load, then redirect if logged out
  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [isPending, session, router]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API}/api/menu-items/${id}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || 'Could not load this item');
        setItem(data.item);
      })
      .catch((e) => setError(e.message));
  }, [id, userId]);

  if (isPending || !session) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Item not found</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button asChild className="mt-6 bg-red-600 hover:bg-red-700"><Link href="/menu">Back to menu</Link></Button>
      </div>
    );
  }

  if (!item) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.images[active]} alt={item.itemName} className="h-80 w-full rounded-xl object-cover md:h-96" />
        {item.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {item.images.map((src, i) => (
              <button key={src} onClick={() => setActive(i)} className={`overflow-hidden rounded-lg border-2 ${i === active ? 'border-red-600' : 'border-transparent'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">{item.category}</span>
        <h1 className="text-3xl font-extrabold">{item.itemName}</h1>
        <p className="text-3xl font-bold text-red-600">${Number(item.price).toFixed(2)}</p>
        <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {item.location}</p>
        <p className="leading-relaxed text-gray-700">{item.description}</p>

        {role === 'customer' && <FavoriteButton itemId={item._id} />}

        <div className="flex items-center gap-3 rounded-xl border bg-white p-4">
          <Store className="h-5 w-5 text-red-600" />
          <div>
            <p className="font-semibold">
              {item.vendor?.businessName || 'PizzaHub Vendor'}
              {item.vendor?.isPremium && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">Owner: {item.vendor?.name}</p>
          </div>
        </div>

        {role === 'customer' ? (
          showForm ? (
            <OrderForm itemId={item._id} />
          ) : (
            <Button onClick={() => setShowForm(true)} className="w-full bg-red-600 py-6 text-base hover:bg-red-700">
              Order Now
            </Button>
          )
        ) : (
          <p className="rounded-lg border bg-yellow-50 p-4 text-sm text-yellow-800">
            {role === 'vendor' ? 'Vendors cannot place orders.' : 'Admins cannot place customer orders.'}
          </p>
        )}
      </div>
    </div>
  );
}