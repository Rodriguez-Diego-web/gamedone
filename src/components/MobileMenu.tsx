'use client';

import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-teal-700 p-6 text-white sm:p-8"
    >
      <div 
        className="relative flex h-full w-full flex-col" 
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center text-xl font-semibold text-white" onClick={onClose}>
            <Sparkles className="mr-2 h-6 w-6 text-teal-200" />
            Friendship Finder
          </Link>
          <button
            onClick={onClose}
            aria-label="Menü schließen"
            className="rounded-full p-2 text-teal-100 transition-colors hover:bg-teal-600 hover:text-white"
          >
            <X size={28} />
          </button>
        </header>

        <nav className="flex flex-1 flex-col items-center justify-center space-y-6 sm:space-y-8">
          <Link
            href="/spielerklaerung"
            className="text-3xl font-bold tracking-tight text-white transition-colors hover:text-teal-200 sm:text-4xl md:text-5xl"
            onClick={onClose}
          >
            SPIELERKLÄRUNG
          </Link>
          <Link
            href="/intention"
            className="text-3xl font-bold tracking-tight text-white transition-colors hover:text-teal-200 sm:text-4xl md:text-5xl"
            onClick={onClose}
          >
            INTENTION
          </Link>
          <Link
            href="/kontakt"
            className="text-3xl font-bold tracking-tight text-white transition-colors hover:text-teal-200 sm:text-4xl md:text-5xl"
            onClick={onClose}
          >
            KONTAKT
          </Link>
        </nav>

        <footer className="mt-12 border-t border-teal-600 pt-6 text-center">
          <p className="text-sm text-teal-100">
            &copy; {new Date().getFullYear()} Friendship Finder. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
