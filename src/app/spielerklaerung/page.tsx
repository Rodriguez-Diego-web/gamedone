import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Users, Edit3, CheckCircle } from 'lucide-react';

export default function SpielerklaerungPage() {
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
                <HelpCircle className="mr-2.5 h-7 w-7 flex-shrink-0 text-blue-500 sm:mr-3 sm:h-8 sm:w-8" />
                <CardTitle className="truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Spielerklärung</CardTitle>
              </div>
            </div>
            <CardDescription className="pl-12 text-base text-muted-foreground sm:pl-16 sm:text-lg">
              So einfach funktioniert der Friendship Finder!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-8 sm:px-8 sm:py-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="mb-3.5 flex items-center text-xl font-semibold text-primary sm:text-2xl">
                <Users className="mr-2.5 h-6 w-6" />
                Das Ziel des Spiels
              </h2>
              <p>
                Finde heraus, wie gut dich deine Freunde wirklich kennen! Erstelle ein persönliches Quiz und teile es, um spielerisch zu entdecken, wer dich am besten einschätzen kann.
              </p>
            </section>
            
            <div className="space-y-8 rounded-lg border border-border/50 bg-muted/20 p-5 sm:p-6">
              <section>
                <h2 className="mb-3.5 flex items-center text-xl font-semibold text-sky-600 dark:text-sky-400 sm:text-2xl">
                  <Edit3 className="mr-2.5 h-6 w-6" />
                  Quiz Erstellen (Für den Ersteller)
                </h2>
                <ol className="list-decimal space-y-2.5 pl-6 text-foreground/80 marker:font-semibold marker:text-sky-600 dark:marker:text-sky-400">
                  <li><strong>Namen eingeben:</strong> Dein Name wird als Quiz-Ersteller angezeigt.</li>
                  <li><strong>Fragen wählen:</strong> Suche 10 passende Fragen aus der Liste aus.</li>
                  <li><strong>Ehrlich antworten:</strong> Das sind die "richtigen" Antworten für dein Quiz.</li>
                  <li><strong>Abschließen & Link erhalten:</strong> Klicke auf den Button, um dein Quiz zu finalisieren.</li>
                  <li><strong>Link teilen:</strong> Kopiere den generierten Link und schicke ihn an deine Freunde!</li>
                </ol>
              </section>

              <section>
                <h2 className="mb-3.5 flex items-center text-xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
                  <CheckCircle className="mr-2.5 h-6 w-6" />
                  Quiz Spielen (Für Freunde)
                </h2>
                <ol className="list-decimal space-y-2.5 pl-6 text-foreground/80 marker:font-semibold marker:text-emerald-600 dark:marker:text-emerald-400">
                  <li><strong>Link öffnen:</strong> Nutze den Quiz-Link, den du bekommen hast.</li>
                  <li><strong>Deinen Namen nennen:</strong> Damit dein Freund deine Punktzahl zuordnen kann.</li>
                  <li><strong>Fragen beantworten:</strong> Wie gut kennst du deinen Freund? Rate seine Antworten!</li>
                  <li><strong>Ergebnis sehen:</strong> Direkt nach dem Quiz siehst du, wie viele Treffer du hattest!</li>
                </ol>
              </section>
            </div>

            <section>
              <h2 className="mb-3.5 text-xl font-semibold text-primary sm:text-2xl">Ergebnisse Ansehen (Für den Ersteller)</h2>
              <p className="mb-3">
                Nachdem deine Freunde teilgenommen haben, kannst du als Ersteller die Rangliste einsehen. Öffne dazu einfach den Quiz-Link erneut, den du auch geteilt hast. Das System erkennt dich als Ersteller (im selben Browser).
              </p>
              <div className="rounded-md border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <p className="font-semibold">Wichtiger Hinweis:</p>
                <p>
                  Die Erkennung als Ersteller funktioniert aktuell nur im selben Browser, in dem das Quiz erstellt wurde. 
                  <span className="mt-1 block text-xs italic text-muted-foreground dark:text-amber-400/70">(Ein Nutzerkonto-System für mehr Flexibilität ist in Planung!)</span>
                </p>
              </div>
            </section>

            <div className="pt-4 text-center">
              <Button asChild size="lg" className="min-w-[200px] rounded-full px-8 py-6 text-lg font-semibold shadow-md transition-transform hover:scale-105 sm:min-w-[220px]">
                <Link href="/">Verstanden, los geht's!</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}