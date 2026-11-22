'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, LayoutDashboard, UserCog, LogOut } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ROLE_BADGE = {
  vendor: 'bg-orange-100 text-orange-700',
  customer: 'bg-green-100 text-green-700',
  admin: 'bg-red-100 text-red-700',
};

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Browse Menu' },
  ];
  if (user) links.push({ href: `/dashboard/${user.role}`, label: 'Dashboard' });

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.startsWith('/dashboard') ? '/dashboard' : href);

  function logout() {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-orange-100 bg-white/85 backdrop-blur-lg transition-shadow ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Logo (left) */}
<Link href="/" className="justify-self-start text-xl font-extrabold text-red-600">
  🍕 PizzaHub
</Link>

        {/* Links (center) */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(l.href)
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-red-600'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions (right) */}
        <div className="flex items-center gap-2 justify-self-end">
          {isPending ? (
            <div className="hidden h-9 w-40 animate-pulse rounded-full bg-orange-100 md:block" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full bg-gradient-to-br from-red-500 to-orange-400 p-0.5 outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-red-400">
                <Avatar className="border-2 border-white">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="bg-orange-100 font-semibold text-red-600">
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="space-y-1">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                      ROLE_BADGE[user.role] || ROLE_BADGE.customer
                    }`}
                  >
                    {user.role}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${user.role}`)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                {user.role !== 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <UserCog className="mr-2 h-4 w-4" /> Profile Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/signin"
                className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-red-600"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-red-200 transition hover:scale-105 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="rounded-md p-2 text-gray-700 hover:bg-orange-50 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-orange-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive(l.href) ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {!user && !isPending && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/signin"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-red-200 py-2 text-center text-sm font-semibold text-red-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-2 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}