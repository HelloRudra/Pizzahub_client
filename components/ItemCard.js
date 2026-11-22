import Link from 'next/link';
import { MapPin, Crown } from 'lucide-react';

export default function ItemCard({ item }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.images?.[0]} alt={item.itemName} className="h-48 w-full object-cover" />
        {item.vendor?.isPremium && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">
            <Crown className="h-3 w-3" /> Premium
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
          {item.category}
        </span>
        <h3 className="line-clamp-1 text-lg font-semibold">{item.itemName}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {item.location}
        </p>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          By {item.vendor?.businessName || 'PizzaHub Vendor'}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xl font-bold text-red-600">${Number(item.price).toFixed(2)}</span>
          <Link
            href={`/menu/${item._id}`}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}