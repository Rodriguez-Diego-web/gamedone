import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">
          &copy; {currentYear} <Link href="https://rodriguez-web.de/" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary hover:underline">Rodriguez-web.de</Link>. Alle Rechte vorbehalten.
        </p>
        <p className="text-xs mb-2">
          Entwickelt mit ❤️ für tolle Freunde.
        </p>
        <div className="flex justify-center space-x-4 text-xs">
          <Link href="https://www.linkedin.com/in/kadir-diego-padin-rodriguez/" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary-foreground hover:underline">
            LinkedIn
          </Link>
          <span className="select-none">|</span>
          <Link href="https://github.com/Rodriguez-Diego-web" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary-foreground hover:underline">
            GitHub
          </Link>
          <span className="select-none">|</span>
          <Link href="https://rodriguez-web.de/" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary-foreground hover:underline">
            Portfolio
          </Link>
        </div>
      </div>
    </footer>
  );
}
