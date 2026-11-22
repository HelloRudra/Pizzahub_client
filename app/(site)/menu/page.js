'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/constants';

const API = process.env.NEXT_PUBLIC_API_URL;
const selectClass =
  'h-9 w-full rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-400';

function BrowseMenu() {
  const params = useSearchParams();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(params.get('category') || '');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [debounced, setDebounced] = useState({ search: '', location: '' });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // wait 400ms after typing before calling the API
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced({ search, location });
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search, location]);

  useEffect(() => {
    const q = new URLSearchParams();
    if (debounced.search) q.set('search', debounced.search);
    if (debounced.location) q.set('location', debounced.location);
    if (category) q.set('category', category);
    if (sort) q.set('sort', sort);
    q.set('page', page);
    q.set('limit', 9);

    setData(null);
    setError('');
    fetch(`${API}/api/menu-items?${q}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError('Could not load menu items. Please try again.'));
  }, [debounced, category, sort, page]);

  function reset() {
    setSearch('');
    setLocation('');
    setCategory('');
    setSort('');
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Browse Menu</h1>
      <p className="mt-1 text-muted-foreground">Find your perfect pizza, sides and drinks.</p>

      <div className="mt-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={selectClass} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Input placeholder="Location / city" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className={selectClass} value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="rounded-lg border bg-white p-10 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : !data ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-orange-100" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className="rounded-lg border bg-white p-10 text-center">
            <p className="text-lg font-semibold">No items found</p>
            <p className="mt-1 text-muted-foreground">Try changing your search or filters.</p>
            <Button onClick={reset} className="mt-4 bg-red-600 hover:bg-red-700">Clear filters</Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{data.total} item(s) found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((item) => <ItemCard key={item._id} item={item} />)}
            </div>
            {data.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="text-sm">Page {data.page} of {data.pages}</span>
                <Button variant="outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading...</p>}>
      <BrowseMenu />
    </Suspense>
  );
}