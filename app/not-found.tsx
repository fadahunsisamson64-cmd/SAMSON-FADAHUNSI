'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-4 text-center">
      <h2 className="text-2xl font-bold text-brand-dark">404 - Page Not Found</h2>
      <p className="text-brand-muted max-w-md">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary transition-colors mt-2">
        Return Home
      </Link>
    </div>
  );
}
