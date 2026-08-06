'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
      if (query) {
        current.set('q', query);
      } else {
        current.delete('q');
      }
      
      const search = current.toString();
      const newPath = search ? `?${search}` : '/explore';
      router.push(newPath, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, searchParams]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for businesses, services..." 
        className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-xl shadow-brand-dark/5 bg-white text-lg focus:ring-2 focus:ring-brand-primary outline-none transition-shadow"
      />
    </div>
  );
}
