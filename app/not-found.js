import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-orange-50 px-4 text-center">
      <p className="text-7xl">🍕</p>
      <h1 className="text-4xl font-extrabold text-gray-900">404 - Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        Looks like this slice is missing. The page you are looking for does not exist.
      </p>
      <Link href="/" className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
        Back to Home
      </Link>
    </div>
  );
}