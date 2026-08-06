import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lumina | Premium Booking Platform',
  description: 'The easiest way for salons, clinics, photographers, consultants and local businesses to manage appointments online.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-brand-background text-brand-text min-h-screen flex flex-col" suppressHydrationWarning>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
