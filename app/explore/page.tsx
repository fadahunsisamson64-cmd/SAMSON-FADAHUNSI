import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Search, MapPin, Star, Building2, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import SearchInput from '@/components/SearchInput';
import { Suspense } from 'react';

export default async function ExplorePage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  const businesses = await prisma.business.findMany({
    where: q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { services: { some: { name: { contains: q, mode: 'insensitive' } } } }
      ]
    } : undefined,
    include: {
      services: true,
      bookings: { include: { review: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-brand-dark tracking-tight">Lumina</Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-brand-muted hover:text-brand-dark font-medium px-4 py-2">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark mb-6 tracking-tight">Discover top-rated services near you</h1>
          <p className="text-lg text-brand-muted mb-8">Book appointments with the best local businesses, from salons to consultants.</p>
          
          <Suspense fallback={<div className="h-14"></div>}>
            <SearchInput />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map(business => {
            const avgRating = business.bookings.filter(b => b.review).length 
              ? (business.bookings.filter(b => b.review).reduce((a, b) => a + b.review!.rating, 0) / business.bookings.filter(b => b.review).length).toFixed(1)
              : 'New';

            return (
              <Link href={`/book/${business.slug}`} key={business.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 relative flex items-center justify-center">
                  {business.logoUrl ? (
                     <Image src={business.logoUrl} alt={business.name} fill className="object-cover" />
                  ) : (
                    <Building2 className="w-16 h-16 text-brand-primary/20" />
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{business.name}</h2>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 text-brand-accent fill-brand-accent" />
                      <span className="text-sm font-semibold text-brand-dark">{avgRating}</span>
                    </div>
                  </div>
                  
                  <p className="text-brand-muted text-sm mb-6 line-clamp-2 flex-1">
                    {business.description || 'Premium services offered by ' + business.name}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {business.services.slice(0, 2).map(service => (
                        <span key={service.id} className="text-xs font-medium px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-full">
                          {service.name}
                        </span>
                      ))}
                      {business.services.length > 2 && (
                        <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-brand-muted rounded-full">
                          +{business.services.length - 2} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-brand-primary font-medium group-hover:text-brand-accent transition-colors">
                      <span>Book Now</span>
                      <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {businesses.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">No businesses found</h3>
              <p className="text-brand-muted">Check back later for new businesses joining Lumina.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
