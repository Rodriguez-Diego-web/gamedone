'use client';

import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react'; 
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

  const iconBaseClass = "absolute h-6 w-6 transform transition-all duration-300 ease-in-out";

  if (!isMounted) {
    return null;
  }

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b sticky top-0 bg-background/95 backdrop-blur z-50">
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
            className={`relative h-10 w-10 p-2 ${isMobileMenuOpen ? 'hover:bg-teal-600' : 'hover:bg-muted'}`}
            aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <Menu
              className={`${iconBaseClass} ${isMobileMenuOpen ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100 text-teal-600 group-hover:text-teal-700'}`}
            />
            <X
              className={`${iconBaseClass} ${isMobileMenuOpen ? 'rotate-0 scale-100 opacity-100 text-white' : '-rotate-90 scale-50 opacity-0'}`}
            />
          </Button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}