'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
import DudesPerfectLogo from '../app/logo.png';

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
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-background p-6 text-foreground sm:p-8"
    >
      <div 
        className="relative flex h-full w-full flex-col" 
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center" onClick={onClose}>
            <Image 
              src={DudesPerfectLogo} 
              alt="Dudes Perfect Logo" 
              width={80} 
              height={20} 
            />
          </Link>
          <button
            onClick={onClose}
            aria-label="Menü schließen"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-muted hover:text-brand-pink"
          >
            <X size={28} />
          </button>
        </header>

        <nav className="flex flex-1 flex-col items-center justify-center space-y-6 sm:space-y-8">
          <Link
            href="/spielerklaerung"
            className="text-3xl font-bold tracking-tight text-foreground transition-colors hover:text-brand-pink sm:text-4xl md:text-5xl"
            onClick={onClose}
          >
            SPIELERKLÄRUNG
          </Link>
          <Link
            href="/intention"
            className="text-3xl font-bold tracking-tight text-foreground transition-colors hover:text-brand-pink sm:text-4xl md:text-5xl"
            onClick={onClose}
          >
            INTENTION
          </Link>
          <Link
            href="/kontakt"
            className="text-3xl font-bold tracking-tight text-foreground transition-colors hover:text-brand-pink sm:text-4xl md:text-5xl"
            onClick={onClose}
          >
            KONTAKT
          </Link>
        </nav>

        <footer className="mt-12 border-t border-muted pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DudesPerfect Quiz. Alle Rechte vorbehalten.
          </p>
        </footer>
      </div>
    </div>
  );
}
