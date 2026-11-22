'use client';

export default function Error({ reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-extrabold">Something went wrong</h1>
      <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
        Try again
      </button>
    </div>
  );
}