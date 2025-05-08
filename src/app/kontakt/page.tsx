import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Linkedin, Github, Briefcase, UserCircle, Link2 } from 'lucide-react';

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800 py-6 sm:py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <Card className="w-full rounded-xl border-none bg-background/80 p-0 shadow-2xl backdrop-blur-lg sm:p-2">
          <CardHeader className="border-b border-border/70 px-6 py-5 sm:px-8 sm:py-6">
            <div className="mb-3 flex items-center sm:mb-4">
              <Link href="/" passHref legacyBehavior>
                <Button variant="ghost" size="icon" className="mr-3 h-10 w-10 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:mr-4">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex min-w-0 flex-1 items-center">
                <Mail className="mr-2.5 h-7 w-7 flex-shrink-0 text-sky-500 sm:mr-3 sm:h-8 sm:w-8" />
                <CardTitle className="truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Kontakt & Info</CardTitle>
              </div>
            </div>
            <CardDescription className="pl-12 text-base text-muted-foreground sm:pl-16 sm:text-lg">
              So erreichst du mich oder erfährst mehr.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 px-6 py-8 sm:px-8 sm:py-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="mb-4 flex items-center text-xl font-semibold text-primary sm:text-2xl">
                <UserCircle className="mr-2.5 h-6 w-6" />
                Über den Entwickler
              </h2>
              <p>
                Hallo! Ich bin Kadir Diego Padin Rodriguez, ein begeisterter Webentwickler und der Kopf hinter dem Friendship Finder.
                Dieses Projekt entstand aus einer Mischung aus Spaß am Programmieren, dem Wunsch, neue Technologien auszuprobieren, und der Idee, eine kleine, unterhaltsame Anwendung für Freunde zu schaffen.
              </p>
              <p className="mt-3">
                Wenn du Feedback, Ideen oder Fragen zum Spiel hast, oder einfach nur Hallo sagen möchtest, zögere nicht, mich zu kontaktieren!
              </p>
            </section>

            <section>
              <h2 className="mb-5 flex items-center text-xl font-semibold text-primary sm:text-2xl">
                <Link2 className="mr-2.5 h-6 w-6 text-blue-500" /> 
                Verbinde dich
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Button asChild variant="outline" className="justify-start rounded-lg border-border/70 py-6 text-base hover:bg-muted sm:py-7">
                  <Link href="mailto:kadirdiegopadin@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-sky-600" />
                    E-Mail schreiben
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start rounded-lg border-border/70 py-6 text-base hover:bg-muted sm:py-7">
                  <Link href="https://www.linkedin.com/in/kadirdiegopadinrodriguez/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Linkedin className="mr-3 h-5 w-5 text-blue-700" />
                    LinkedIn Profil
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start rounded-lg border-border/70 py-6 text-base hover:bg-muted sm:py-7">
                  <Link href="https://github.com/kadirdiego" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Github className="mr-3 h-5 w-5 text-gray-800 dark:text-gray-300" />
                    GitHub Profil
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start rounded-lg border-border/70 py-6 text-base hover:bg-muted sm:py-7">
                  <Link href="https://kadirdiego.com/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Briefcase className="mr-3 h-5 w-5 text-green-600" />
                    Persönliches Portfolio
                  </Link>
                </Button>
              </div>
            </section>

            <div className="pt-6 text-center">
              <Button asChild size="lg" className="min-w-[200px] rounded-full px-8 py-6 text-lg font-semibold shadow-md transition-transform hover:scale-105 sm:min-w-[220px]">
                <Link href="/">Zurück zur Startseite</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}