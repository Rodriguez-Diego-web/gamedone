import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Users, Edit3, CheckCircle } from 'lucide-react';

export default function SpielerklaerungPage() {
  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-10">
      <div className="container mx-auto max-w-3xl px-3 sm:px-4">
        <div className="w-full">
          {/* Header - Mobile-First: größere Touch-Targets */}
          <div className="px-3 py-4 sm:px-6 md:px-8 md:py-6">
            <div className="mb-2 flex items-center md:mb-4">
              <Link href="/" passHref legacyBehavior>
                <Button variant="ghost" size="icon" className="mr-2 h-12 w-12 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground md:mr-4">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <div className="flex min-w-0 flex-1 items-center">
                <HelpCircle className="mr-2 h-6 w-6 flex-shrink-0 text-primary md:mr-3 md:h-8 md:w-8" />
                <h1 className="truncate text-xl font-extrabold tracking-tight text-foreground sm:text-2xl md:text-3xl">Spielerklärung</h1>
              </div>
            </div>
            <p className="pl-10 text-sm text-muted-foreground sm:pl-12 sm:text-base md:pl-16 md:text-lg">
              So einfach funktioniert der Friendship Finder!
            </p>
          </div>
          
          {/* Content - Optimiert für Mobilgeräte */}
          <div className="space-y-6 px-3 py-5 sm:space-y-7 sm:px-6 sm:py-6 md:space-y-8 md:px-8 md:py-10 text-sm sm:text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="mb-2.5 flex items-center text-lg font-semibold text-primary sm:mb-3 sm:text-xl md:mb-3.5 md:text-2xl">
                <Users className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
                Das Ziel des Spiels
              </h2>
              <p className="text-sm sm:text-base">
                Finde heraus, wie gut dich deine Freunde wirklich kennen! Erstelle ein persönliches Quiz und teile es, um spielerisch zu entdecken, wer dich am besten einschätzen kann.
              </p>
            </section>
            
            <div className="space-y-6 rounded-lg p-3 sm:space-y-7 sm:p-4 md:space-y-8 md:p-5">
              <section>
                <h2 className="mb-2.5 flex items-center text-lg font-semibold text-primary sm:mb-3 sm:text-xl md:mb-3.5 md:text-2xl">
                  <Edit3 className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
                  Quiz Erstellen (Für den Ersteller)
                </h2>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/80 marker:font-semibold marker:text-primary sm:space-y-2.5 sm:pl-6 sm:text-base">
                  <li><strong>Namen eingeben:</strong> Dein Name wird als Quiz-Ersteller angezeigt.</li>
                  <li><strong>Fragen wählen:</strong> Suche 10 passende Fragen aus der Liste aus.</li>
                  <li><strong>Ehrlich antworten:</strong> Das sind die "richtigen" Antworten für dein Quiz.</li>
                  <li><strong>Abschließen & Link erhalten:</strong> Klicke auf den Button, um dein Quiz zu finalisieren.</li>
                  <li><strong>Link teilen:</strong> Kopiere den generierten Link und schicke ihn an deine Freunde!</li>
                </ol>
              </section>

              <section>
                <h2 className="mb-2.5 flex items-center text-lg font-semibold text-primary sm:mb-3 sm:text-xl md:mb-3.5 md:text-2xl">
                  <CheckCircle className="mr-2 h-5 w-5 sm:mr-2.5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
                  Quiz Lösen (Für Freunde)
                </h2>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/80 marker:font-semibold marker:text-primary sm:space-y-2.5 sm:pl-6 sm:text-base">
                  <li><strong>Quiz öffnen:</strong> Klicke auf den Link, den du erhalten hast.</li>
                  <li><strong>Namen eingeben:</strong> Damit der Ersteller später sehen kann, wer am besten war!</li>
                  <li><strong>Antworten wählen:</strong> Wähle aus, was du denkst, dass der Ersteller geantwortet hat.</li>
                  <li><strong>Ergebnis erhalten:</strong> Am Ende siehst du, wie gut du den Ersteller kennst.</li>
                </ol>
              </section>
            </div>

            <section>
              <h2 className="mb-2.5 text-lg font-semibold text-primary sm:mb-3 sm:text-xl md:mb-3.5 md:text-2xl">Ergebnisse Ansehen (Für den Ersteller)</h2>
              <p className="mb-2 text-sm sm:mb-3 sm:text-base">
                Nachdem deine Freunde teilgenommen haben, kannst du als Ersteller die Rangliste einsehen. Öffne dazu einfach den Quiz-Link erneut, den du auch geteilt hast. Das System erkennt dich als Ersteller (im selben Browser).
              </p>
              <div className="rounded-md border-l-3 sm:border-l-4 border-amber-500 bg-amber-50 p-3 sm:p-4 text-xs sm:text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <p className="font-semibold">Wichtiger Hinweis:</p>
                <p>
                  Die Erkennung als Ersteller funktioniert aktuell nur im selben Browser, in dem das Quiz erstellt wurde. 
                  <span className="mt-1 block text-xs italic text-muted-foreground dark:text-amber-400/70">(Ein Nutzerkonto-System für mehr Flexibilität ist in Planung!)</span>
                </p>
              </div>
            </section>

            <div className="pt-4 sm:pt-6 text-center">
              <Button asChild className="min-w-[180px] rounded-full px-5 py-4 text-sm font-semibold shadow-md transition-transform hover:scale-105 sm:min-w-[200px] sm:px-6 sm:py-5 sm:text-base md:min-w-[220px] md:px-8 md:py-6 md:text-lg">
                <Link href="/">Verstanden, los geht's!</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}