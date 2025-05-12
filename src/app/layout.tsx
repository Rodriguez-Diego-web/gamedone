import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css'; 
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider'; 
import NextTopLoader from 'nextjs-toploader';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Dudes Perfect',
  description: 'Create and share quizzes to find out how well your friends know you!',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

const brandStyles = `
  :root {
    --brand-pink-h: 330;
    --brand-pink-s: 82%;
    --brand-pink-l: 60%;
    --brand-cyan-h: 190;
    --brand-cyan-s: 80%;
    --brand-cyan-l: 53%;
    --primary-foreground-h: 0;
    --primary-foreground-s: 0%;
    --primary-foreground-l: 100%;
    /* Define light theme base if not in globals.css (example) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: var(--brand-pink-h) var(--brand-pink-s) var(--brand-pink-l);
    --secondary: 210 40% 96.1%;
    --muted: 210 40% 96.1%;
    --accent: 210 40% 96.1%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 330 82% 60%; /* brand-pink for focus rings */
  }

  .dark {
    --background: 0 0% 0%; /* Pure Black */
    --foreground: 0 0% 90%; /* Lighter gray for text on black */
    --card: 0 0% 7%; /* Very dark gray for cards, slightly off-black */
    --card-foreground: 0 0% 90%;
    --popover: 0 0% 7%;
    --popover-foreground: 0 0% 90%;
    --primary: var(--brand-pink-h) var(--brand-pink-s) var(--brand-pink-l);
    --primary-foreground: var(--primary-foreground-h) var(--primary-foreground-s) var(--primary-foreground-l); /* white */
    --secondary: 0 0% 10%; 
    --secondary-foreground: 0 0% 90%;
    --muted: 0 0% 10%;
    --muted-foreground: 0 0% 60%; /* Dimmer white */
    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 90%;
    --destructive: 0 62.8% 30.6%; /* Darker red */
    --destructive-foreground: 0 0% 90%;
    --border: 0 0% 15%; /* Dark gray border */
    --input: 0 0% 15%;  /* Dark gray input */
    --ring: var(--brand-pink-h) var(--brand-pink-s) var(--brand-pink-l); /* Pink focus ring */
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: brandStyles }} />
      </head>
      <body className="antialiased flex flex-col min-h-screen dark">
        {/* ThemeProvider mit forcedTheme statt defaultTheme für konsistentes Rendering */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark" // Erzwingt konsistentes Dark Theme auf Server und Client
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextTopLoader color="hsl(var(--brand-pink-h) var(--brand-pink-s) var(--brand-pink-l))" showSpinner={false} />
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
