'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Browse Menu' },
  ];
  if (user) links.push({ href: `/dashboard/${user.role}`, label: 'Dashboard' });

  function logout() {
    signOut({ fetchOptions: { onSuccess: () => { router.push('/'); router.refresh(); } } });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-extrabold text-red-600">🍕 PizzaHub</Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-700 hover:text-red-600">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                <Avatar>
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground capitalize">{user.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${user.role}`)}>Dashboard</DropdownMenuItem>
                {user.role !== 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>Profile Settings</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button asChild variant="outline"><Link href="/signin">Sign In</Link></Button>
              <Button asChild className="bg-red-600 hover:bg-red-700"><Link href="/signup">Sign Up</Link></Button>
            </div>
          )}

          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-1 border-t bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-orange-100">
              {l.label}
            </Link>
          ))}
          {!user && !isPending && (
            <>
              <Link href="/signin" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-orange-100">Sign In</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-orange-100">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}