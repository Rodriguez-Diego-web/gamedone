// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-background py-8 text-center text-foreground">
      <div className="container mx-auto">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <Link href="https://rodriguez-web.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rodriguez-web.de</Link>. Alle Rechte vorbehalten.
        </p>
        <p className="text-xs mt-2">
          Erstellt mit ❤️ für tolle Freunde.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
