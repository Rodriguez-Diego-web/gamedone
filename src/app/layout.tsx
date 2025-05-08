import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Friendship Finder',
  description: 'Create and share quizzes to find out how well your friends know you!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="antialiased flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
