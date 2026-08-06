'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-4 text-center">
      <h2 className="text-2xl font-bold text-brand-dark">Something went wrong!</h2>
      <p className="text-brand-muted max-w-md">An unexpected error occurred. Please try again or return to the home page.</p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 border border-gray-200 text-brand-dark rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
