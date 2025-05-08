import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">
          &copy; {currentYear} Rodríguez Web. Alle Rechte vorbehalten.
        </p>
        <p className="text-xs mb-2">
          Entwickelt mit ❤️ von Diego Rodríguez.
        </p>
        <div className="flex justify-center space-x-4 text-xs">
          {/* Ersetze '#' mit deinen tatsächlichen Links */}
          <Link href="#" className="hover:text-primary dark:hover:text-primary-foreground">
            LinkedIn
          </Link>
          <span className="select-none">|</span>
          <Link href="#" className="hover:text-primary dark:hover:text-primary-foreground">
            GitHub
          </Link>
          <span className="select-none">|</span>
          <Link href="#" className="hover:text-primary dark:hover:text-primary-foreground">
            Portfolio
          </Link>
        </div>
      </div>
    </footer>
  );
}
