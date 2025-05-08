import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, Sparkles, ShieldCheck } from 'lucide-react';

export default function IntentionPage() {
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
                <Lightbulb className="mr-2.5 h-7 w-7 flex-shrink-0 text-amber-500 sm:mr-3 sm:h-8 sm:w-8" />
                <CardTitle className="truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Intention des Spiels</CardTitle>
              </div>
            </div>
            <CardDescription className="pl-12 text-base text-muted-foreground sm:pl-16 sm:text-lg">
              Warum gibt es den Friendship Finder?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-8 sm:px-8 sm:py-10 text-base leading-relaxed text-foreground/90">
            <section>
              <p className="text-lg sm:text-xl">
                In unserer schnelllebigen, digitalen Welt kann es manchmal schwierig sein, echte Verbindungen zu pflegen und wirklich zu wissen, wie gut wir unsere Freunde eigentlich kennen – und sie uns.
              </p>
              <p className="mt-4">
                Der Friendship Finder wurde aus dem Wunsch heraus geboren, eine spielerische und unterhaltsame Möglichkeit zu schaffen, genau das herauszufinden. Es geht nicht darum, perfekt abzuschneiden oder einen Wettbewerb zu gewinnen. Vielmehr soll es ein Anstoß sein, sich auf einer anderen Ebene mit Freunden auseinanderzusetzen, vielleicht über Dinge zu schmunzeln, die man voneinander dachte, oder neue kleine Details übereinander zu erfahren. Ein Eisbrecher, ein Gesprächsstarter, oder einfach nur ein netter Zeitvertreib.
              </p>
            </section>
            
            <section className="rounded-lg border border-border/50 bg-muted/20 p-5 sm:p-6">
              <h2 className="mb-3.5 flex items-center text-xl font-semibold text-primary sm:text-2xl">
                <Sparkles className="mr-2.5 h-6 w-6 text-purple-500" />
                Mehr als nur ein Quiz
              </h2>
              <p className="text-foreground/80">
                Dieses Projekt ist auch eine kleine Reise in die Webentwicklung, ein Experiment mit modernen Technologien (wie Next.js, TypeScript und Tailwind CSS) und dem Ziel, eine interaktive und ansprechende Erfahrung zu schaffen, die Freude bereitet. 
                Es soll zeigen, wie man auch als Einzelperson oder kleines Team mit den heutigen Werkzeugen ansprechende Anwendungen entwickeln kann, die Menschen vielleicht ein kleines Lächeln ins Gesicht zaubern.
              </p>
              <p className="mt-3 text-foreground/80">
                Vielleicht inspiriert es dich ja sogar, selbst kreativ zu werden, ein eigenes kleines Projekt zu starten oder einfach nur eine gute Zeit mit deinen Freunden zu haben!
              </p>
            </section>

            <section className="rounded-lg border border-border/50 bg-muted/20 p-5 sm:p-6">
              <h2 className="mb-3.5 flex items-center text-xl font-semibold text-primary sm:text-2xl">
                <ShieldCheck className="mr-2.5 h-6 w-6 text-green-500" />
                Deine Privatsphäre & Entwicklung
              </h2>
              <p className="text-foreground/80">
                Aktuell werden die Quiz-Ergebnisse und die Antworten deiner Freunde direkt in einer einfachen Cloud-Datenbank (Firebase Firestore) gespeichert, um die Rangliste für den Ersteller zu ermöglichen. 
                Es gibt noch keine Nutzerkonten, daher ist die Zuordnung zum Ersteller über lokale Browserspeicher gelöst – eine einfache, aber für den Moment funktionale Lösung.
              </p>
              <p className="mt-3 text-foreground/80">
                Langfristig sind natürlich robustere Lösungen wie richtige Nutzerkonten wünschenswert, um dir mehr Kontrolle und Sicherheit über deine Daten zu geben und die Nutzung über verschiedene Geräte hinweg zu erleichtern. Dieses Projekt entwickelt sich ständig weiter!
              </p>
            </section>

            <div className="pt-4 text-center">
              <Button asChild size="lg" className="min-w-[200px] rounded-full px-8 py-6 text-lg font-semibold shadow-md transition-transform hover:scale-105 sm:min-w-[220px]">
                <Link href="/">Verstanden, sehr cool!</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}