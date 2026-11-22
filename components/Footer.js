import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold text-white">🍕 PizzaHub</p>
          <p className="mt-3 text-sm">Discover local pizza shops, browse their menus and get hot, fresh pizza delivered to your door.</p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/menu" className="hover:text-white">Browse Menu</Link></li>
            <li><Link href="/signin" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Contact</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@pizzahub.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +880 1234 567890</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dhaka, Bangladesh</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Follow Us</p>
          <div className="flex gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="rounded-full bg-gray-800 p-2 hover:bg-red-600"><XLogo /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full bg-gray-800 px-3 py-2 text-sm hover:bg-red-600">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full bg-gray-800 px-3 py-2 text-sm hover:bg-red-600">Instagram</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © 2026 PizzaHub. All rights reserved. 
      </div>
    </footer>
  );
}