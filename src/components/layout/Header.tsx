'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import MobileMenu from '@/components/MobileMenu'; 
import Image from 'next/image'; 
import DudesPerfectLogo from '../../app/logo.png'; 

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Image 
            src={DudesPerfectLogo} 
            alt="Dudes Perfect Logo" 
            width={70} 
            height={20} 
            priority 
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/quiz">Quiz erstellen</Link>
          </Button>
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost" 
            size="icon"
            onClick={toggleMobileMenu}
            className="relative h-10 w-10 p-2 flex flex-col justify-center items-center overflow-hidden !bg-transparent hover:!bg-transparent border-none shadow-none"
            aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <div className="relative w-6 h-5">
              {/* Oberer Strich */}
              <span
                className={`absolute top-0 left-0 block h-0.5 w-full bg-foreground transition-all duration-500 ease-in-out transform-gpu
                            ${isMobileMenuOpen ? 'top-[9px] rotate-45' : ''}`}
              ></span>
              
              {/* Mittlerer Strich */}
              <span
                className={`absolute top-[9px] left-0 block h-0.5 w-full bg-foreground transition-all duration-500 ease-in-out
                            ${isMobileMenuOpen ? 'opacity-0 translate-x-3' : ''}`}
              ></span>
              
              {/* Unterer Strich */}
              <span
                className={`absolute bottom-0 left-0 block h-0.5 w-full bg-foreground transition-all duration-500 ease-in-out transform-gpu
                            ${isMobileMenuOpen ? 'bottom-[9px] -rotate-45' : ''}`}
              ></span>
            </div>
          </Button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}