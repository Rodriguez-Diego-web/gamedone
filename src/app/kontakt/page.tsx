import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Linkedin, Github, Briefcase, UserCircle, Link2, PcCaseIcon } from 'lucide-react';

export default function KontaktPage() {
  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-10">
      <div className="container mx-auto max-w-3xl px-3 sm:px-4">
        <div className="w-full">
          {/* Header - Mobile-First: kleinere Abstände, größere Touch-Targets */}
          <div className="px-3 py-4 sm:px-6 md:px-8 md:py-6">
            <div className="mb-2 flex items-center md:mb-4">
              <Link href="/" passHref legacyBehavior>
                <Button variant="ghost" size="icon" className="mr-2 h-12 w-12 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground md:mr-4">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <div className="flex min-w-0 flex-1 items-center">
                <Mail className="mr-2 h-6 w-6 flex-shrink-0 text-primary md:mr-3 md:h-8 md:w-8" />
                <h1 className="truncate text-xl font-extrabold tracking-tight text-foreground sm:text-2xl md:text-3xl">Kontakt & Info</h1>
              </div>
            </div>
            <p className="pl-10 text-sm text-muted-foreground sm:pl-12 sm:text-base md:pl-16 md:text-lg">
              So erreichst du mich oder erfährst mehr.
            </p>
          </div>
          
          {/* Content - Kleinere Abstände auf Mobilgeräten */}
          <div className="space-y-8 px-3 py-5 sm:px-6 sm:py-6 md:space-y-10 md:px-8 md:py-10 text-sm sm:text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="mb-3 flex items-center text-lg font-semibold text-primary sm:mb-4 sm:text-xl md:text-2xl">
                <UserCircle className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6" />
                Über den Entwickler
              </h2>
              <p className="text-sm sm:text-base">
                Hallo! Ich bin Kadir Diego Padin Rodriguez, ein begeisterter Webentwickler und der Kopf hinter dem Friendship Finder.
                Dieses Projekt entstand aus einer Mischung aus Spaß am Programmieren, dem Wunsch, neue Technologien auszuprobieren, und der Idee, eine kleine, unterhaltsame Anwendung für Freunde zu schaffen.
              </p>
              <p className="mt-2 text-sm sm:mt-3 sm:text-base">
                Wenn du Feedback, Ideen oder Fragen zum Spiel hast, oder einfach nur Hallo sagen möchtest, zögere nicht, mich zu kontaktieren!
              </p>
            </section>

            <section>
              <h2 className="mb-3 flex items-center text-lg font-semibold text-primary sm:mb-4 sm:text-xl md:text-2xl">
                <Link2 className="mr-2 h-5 w-5 text-primary sm:mr-2.5 sm:h-6 sm:w-6" /> 
                Verbinde dich
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5">
                <Button asChild variant="outline" className="h-14 justify-start rounded-lg border-border/70 px-4 py-3 text-sm hover:bg-muted sm:py-4 sm:text-base md:h-16 md:py-5">
                  <Link href="mailto:diego@rodriguez-web.de" target="_blank" rel="noopener noreferrer" className="flex w-full items-center">
                    <Mail className="mr-2 h-5 w-5 text-primary sm:mr-3" />
                    E-Mail schreiben
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-14 justify-start rounded-lg border-border/70 px-4 py-3 text-sm hover:bg-muted sm:py-4 sm:text-base md:h-16 md:py-5">
                  <Link href="https://www.linkedin.com/in/kadir-diego-padin-rodriguez/" target="_blank" rel="noopener noreferrer" className="flex w-full items-center">
                    <Linkedin className="mr-2 h-5 w-5 text-primary sm:mr-3" />
                    LinkedIn Profil
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-14 justify-start rounded-lg border-border/70 px-4 py-3 text-sm hover:bg-muted sm:py-4 sm:text-base md:h-16 md:py-5">
                  <Link href="https://github.com/Rodriguez-Diego-web" target="_blank" rel="noopener noreferrer" className="flex w-full items-center">
                    <Github className="mr-2 h-5 w-5 text-primary sm:mr-3" />
                    GitHub Profil
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-14 justify-start rounded-lg border-border/70 px-4 py-3 text-sm hover:bg-muted sm:py-4 sm:text-base md:h-16 md:py-5">
                  <Link href="https://rodriguez-web.de/" target="_blank" rel="noopener noreferrer" className="flex w-full items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary sm:mr-3" />
                    Persönliches Portfolio
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-14 justify-start rounded-lg border-border/70 px-4 py-3 text-sm hover:bg-muted sm:py-4 sm:text-base md:h-16 md:py-5">
                  <Link href="https://rodriguez-digital.de/" target="_blank" rel="noopener noreferrer" className="flex w-full items-center">
                    <PcCaseIcon className="mr-2 h-5 w-5 text-primary sm:mr-3" />
                    Webentwicklung
                  </Link>
                </Button>
              </div>
            </section>

            <div className="pt-4 sm:pt-6 text-center">
              <Button asChild className="min-w-[180px] rounded-full px-5 py-4 text-sm font-semibold shadow-md transition-transform hover:scale-105 sm:min-w-[200px] sm:px-8 sm:py-5 sm:text-base md:py-6 md:text-lg">
                <Link href="/">Zurück zur Startseite</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}