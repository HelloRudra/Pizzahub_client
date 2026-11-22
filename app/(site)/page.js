'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, Flame, Store, Search, ShoppingBag } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { CATEGORIES } from '@/lib/constants';

const API = process.env.NEXT_PUBLIC_API_URL;

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const CATEGORY_EMOJI = ['🍕', '🥗', '🥩', '👨‍🍳', '🍟', '🥤'];

const WHY = [
  { icon: Flame, title: 'Hot & Fresh', text: 'Pizzas made to order by local shops and delivered fast.' },
  { icon: Store, title: 'Local Restaurants', text: 'Discover and support pizza shops in your own area.' },
  { icon: Truck, title: 'Easy Ordering', text: 'Pick a date, add your address and track your order.' },
  { icon: ShieldCheck, title: 'Verified Menus', text: 'Every menu item is reviewed by our team before it goes live.' },
];

const STEPS = [
  { icon: Search, title: 'Browse', text: 'Search and filter pizzas, sides and drinks.' },
  { icon: ShoppingBag, title: 'Order', text: 'Choose a delivery date and place your order.' },
  { icon: Truck, title: 'Enjoy', text: 'The restaurant accepts and prepares your food.' },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export default function HomePage() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/menu-items/featured`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-400 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Hot &amp; Fresh Pizza Delivered to Your Door
            </h1>
            <p className="mt-4 max-w-lg text-lg text-orange-50">
              Discover local pizza shops, browse their menus and order your favorite pizza in a few clicks.
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-red-600 shadow-lg transition hover:scale-105"
            >
              Explore Pizza Menu
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/15 text-[9rem] shadow-2xl backdrop-blur md:h-80 md:w-80 md:text-[11rem]">
              🍕
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured items */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <motion.div {...fade}>
          <SectionTitle title="Featured Menu Items" subtitle="Fresh picks from our top restaurants" />
        </motion.div>
        {!items ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-orange-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-lg border bg-white p-10 text-center text-muted-foreground">
            No menu items available yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <motion.div key={item._id} {...fade}>
                <ItemCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/menu" className="font-semibold text-red-600 hover:underline">View all menu items →</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-orange-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div {...fade}>
            <SectionTitle title="Pizza Categories" subtitle="Explore the menu by what you feel like eating" />
          </motion.div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <motion.div key={c} {...fade}>
                <Link
                  href={`/menu?category=${encodeURIComponent(c)}`}
                  className="flex h-full flex-col items-center gap-2 rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-red-400 hover:shadow-md"
                >
                  <span className="text-4xl">{CATEGORY_EMOJI[i]}</span>
                  <span className="font-semibold">{c}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <motion.div {...fade}>
          <SectionTitle title="Why Choose PizzaHub?" subtitle="Everything you need for a great pizza night" />
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ icon: Icon, title, text }) => (
            <motion.div key={title} {...fade} className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-orange-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div {...fade}>
            <SectionTitle title="How PizzaHub Works" subtitle="Three simple steps" />
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <motion.div key={title} {...fade} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-red-600">STEP {i + 1}</p>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}