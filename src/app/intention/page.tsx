import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, Sparkles, ShieldCheck } from 'lucide-react';

export default function IntentionPage() {
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
                <Lightbulb className="mr-2 h-6 w-6 flex-shrink-0 text-primary md:mr-3 md:h-8 md:w-8" />
                <h1 className="truncate text-xl font-extrabold tracking-tight text-foreground sm:text-2xl md:text-3xl">Intention des Spiels</h1>
              </div>
            </div>
            <p className="pl-10 text-sm text-muted-foreground sm:pl-12 sm:text-base md:pl-16 md:text-lg">
              Warum gibt es den Friendship Finder?
            </p>
          </div>
          
          {/* Content - Optimiert für Mobilgeräte */}
          <div className="space-y-6 px-3 py-5 sm:space-y-7 sm:px-6 sm:py-6 md:space-y-8 md:px-8 md:py-10 text-sm sm:text-base leading-relaxed text-foreground/90">
            <section>
              <p className="text-base sm:text-lg md:text-xl">
                In unserer schnelllebigen, digitalen Welt kann es manchmal schwierig sein, echte Verbindungen zu pflegen und wirklich zu wissen, wie gut wir unsere Freunde eigentlich kennen – und sie uns.
              </p>
              <p className="mt-3 text-sm sm:mt-4 sm:text-base">
                Der Friendship Finder wurde aus dem Wunsch heraus geboren, eine spielerische und unterhaltsame Möglichkeit zu schaffen, genau das herauszufinden. Es geht nicht darum, perfekt abzuschneiden oder einen Wettbewerb zu gewinnen. Vielmehr soll es ein Anstoß sein, sich auf einer anderen Ebene mit Freunden auseinanderzusetzen, vielleicht über Dinge zu schmunzeln, die man voneinander dachte, oder neue kleine Details übereinander zu erfahren. Ein Eisbrecher, ein Gesprächsstarter, oder einfach nur ein netter Zeitvertreib.
              </p>
            </section>
            
            <section className="rounded-lg p-3 sm:p-4 md:p-5">
              <h2 className="mb-2.5 flex items-center text-lg font-semibold text-primary sm:mb-3 sm:text-xl md:mb-3.5 md:text-2xl">
                <Sparkles className="mr-2 h-5 w-5 text-primary sm:mr-2.5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
                Mehr als nur ein Quiz
              </h2>
              <p className="text-sm text-foreground/90 sm:text-base">
                Dieses Projekt ist auch eine kleine Reise in die Webentwicklung, ein Experiment mit modernen Technologien (wie Next.js, TypeScript und Tailwind CSS) und dem Ziel, eine interaktive und ansprechende Erfahrung zu schaffen, die Freude bereitet. 
                Es soll zeigen, wie man auch als Einzelperson oder kleines Team mit den heutigen Werkzeugen ansprechende Anwendungen entwickeln kann, die Menschen vielleicht ein kleines Lächeln ins Gesicht zaubern.
              </p>
              <p className="mt-2 text-sm text-foreground/90 sm:mt-3 sm:text-base">
                Vielleicht inspiriert es dich ja sogar, selbst kreativ zu werden, ein eigenes kleines Projekt zu starten oder einfach nur eine gute Zeit mit deinen Freunden zu haben!
              </p>
            </section>

            <section className="rounded-lg p-3 sm:p-4 md:p-5">
              <h2 className="mb-2.5 flex items-center text-lg font-semibold text-primary sm:mb-3 sm:text-xl md:mb-3.5 md:text-2xl">
                <ShieldCheck className="mr-2 h-5 w-5 text-primary sm:mr-2.5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
                Deine Privatsphäre & Entwicklung
              </h2>
              <p className="text-sm text-foreground/90 sm:text-base">
                Aktuell werden die Quiz-Ergebnisse und die Antworten deiner Freunde direkt in einer einfachen Cloud-Datenbank (Firebase Firestore) gespeichert, um die Rangliste für den Ersteller zu ermöglichen. 
                Es gibt noch keine Nutzerkonten, daher ist die Zuordnung zum Ersteller über lokale Browserspeicher gelöst – eine einfache, aber für den Moment funktionale Lösung.
              </p>
              <p className="mt-2 text-sm text-foreground/90 sm:mt-3 sm:text-base">
                Langfristig sind natürlich robustere Lösungen wie richtige Nutzerkonten wünschenswert, um dir mehr Kontrolle und Sicherheit über deine Daten zu geben und die Nutzung über verschiedene Geräte hinweg zu erleichtern. Dieses Projekt entwickelt sich ständig weiter!
              </p>
            </section>

            <div className="pt-4 sm:pt-6 text-center">
              <Button asChild className="min-w-[180px] rounded-full px-5 py-4 text-sm font-semibold shadow-md transition-transform hover:scale-105 sm:min-w-[200px] sm:px-6 sm:py-5 sm:text-base md:min-w-[220px] md:px-8 md:py-6 md:text-lg">
                <Link href="/">Verstanden, sehr cool!</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}