'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, UtensilsCrossed, PlusCircle, ClipboardList, Crown, UserCog,
  Users, CreditCard, ShoppingBag, LogOut, Home, Loader2, Heart,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

const ROLES = ['vendor', 'customer', 'admin'];

const NAV = {
  vendor: [
    { href: '/dashboard/vendor', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/vendor/items', label: 'My Menu Items', icon: UtensilsCrossed },
    { href: '/dashboard/vendor/add', label: 'Add Menu Item', icon: PlusCircle },
    { href: '/dashboard/vendor/orders', label: 'Customer Orders', icon: ClipboardList },
    { href: '/dashboard/vendor/subscription', label: 'Subscription', icon: Crown },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: UserCog },
  ],
  customer: [
    { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/customer/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/dashboard/customer/favorites', label: 'Favorites', icon: Heart },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: UserCog },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
    { href: '/dashboard/admin/items', label: 'Manage Menu Items', icon: UtensilsCrossed },
    { href: '/dashboard/admin/transactions', label: 'Transactions', icon: CreditCard },
  ],
};

function FullLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;
  const section = pathname.split('/')[2];
  const wrongRole = Boolean(user) && ROLES.includes(section) && section !== user.role;

  useEffect(() => {
    // Wait until the session has finished loading before deciding anything
    if (isPending) return;
    if (!session) router.replace('/signin');
    else if (wrongRole) router.replace('/dashboard');
  }, [isPending, session, wrongRole, router]);

  if (isPending || !user || wrongRole) return <FullLoader />;

  if (user.isBlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Account blocked</h1>
        <p>Your account has been blocked. Please contact support.</p>
        <Button onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push('/signin') } })}>
          Logout
        </Button>
      </div>
    );
  }

  const links = NAV[user.role] || NAV.customer;
  const overviewHref = `/dashboard/${user.role}`;

  return (
    <div className="min-h-screen bg-orange-50/50 md:flex">
      <aside className="border-b bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="px-4 py-3 md:py-5">
          <Link href="/" className="text-xl font-extrabold text-red-600">🍕 PizzaHub</Link>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user.name} · {user.role}
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === overviewHref ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-100">
            <Home className="h-4 w-4" /> Home
          </Link>
          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push('/signin') } })}
            className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-100"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}