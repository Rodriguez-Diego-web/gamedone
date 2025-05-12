import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Gift, PencilLine, Send, Award, Zap } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center text-center space-y-16 py-8">
      <section className="space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Teste eure Verbindung: Das ultimative <span className="text-primary">Freundschafts-Quiz</span>!
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Erstelle personalisierte Quizze, fordere deine Freunde heraus und entdecke, wer dich wirklich kennt. Unterhaltsam, schnell und kostenlos!
        </p>
        <Link href="/name">
          <Button size="lg" className="text-xl px-6 sm:px-10 py-7 shadow-lg hover:shadow-xl transition-shadow">
            <Sparkles className="mr-2 h-6 w-6" />
            <span className="hidden sm:inline">Erstelle dein Quiz & finde es heraus!</span>
            <span className="sm:hidden">Quiz erstellen!</span>
          </Button>
        </Link>
      </section>

      <section className="w-full max-w-4xl">
        <Image 
          src="https://picsum.photos/1200/450?grayscale&blur=1"
          alt="Vielfältige Gruppe von Freunden, die spaßig über ein Quiz-Konzept interagieren" 
          width={1200} 
          height={450}
          className="rounded-xl shadow-2xl object-cover"
          data-ai-hint="friends fun quiz"
          priority
        />
      </section>

      <section className="w-full max-w-5xl space-y-10">
        <h2 className="text-3xl font-semibold tracking-tight">So funktioniert's in 3 einfachen Schritten</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4">
            <CardHeader className="items-center">
              <PencilLine className="text-primary h-10 w-10 mb-3" />
              <CardTitle>1. Erstellen</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Personalisiere dein Quiz: Gib deinen Namen ein und beantworte einige lustige Fragen über dich.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4">
            <CardHeader className="items-center">
              <Send className="text-primary h-10 w-10 mb-3" />
              <CardTitle>2. Teilen</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fordere deine Crew heraus: Erhalte einen einzigartigen Link, den du über jede Plattform an deine Freunde senden kannst.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4">
            <CardHeader className="items-center">
              <Award className="text-primary h-10 w-10 mb-3" />
              <CardTitle>3. Entdecken</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sieh, wer dich am besten kennt: Beobachte, wie die Ergebnisse eintreffen, und kröne deinen besten Freund!
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-10 pt-8">
        <h2 className="text-3xl font-semibold tracking-tight">Warum du es lieben wirst</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary h-7 w-7" />
                Entfache fröhlichen Wettbewerb
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Beziehe deine Freunde in eine unbeschwerte Herausforderung ein und lacht gemeinsam, während ihr eure Verbindung testet.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-primary h-7 w-7" />
                Schnelle & einfache Einrichtung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Von Null zum fertigen Quiz in Minuten. Keine Anmeldung, nur purer, unverfälschter Spaß.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="text-primary h-7 w-7" />
                Sofortiger Spaß, bleibende Erinnerungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schaffe unvergessliche Momente und finde heraus, wer wirklich mit dir auf einer Wellenlänge ist, eine Frage nach der anderen.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-10 pt-16">
        <h2 className="text-3xl font-semibold tracking-tight">KI-Powered Personalisierung</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          Unser Quiz nutzt fortschrittliche KI-Technologie, um deine Antworten zu analysieren und bessere Erfahrungen zu bieten.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4 border-t-4 border-t-primary">
            <CardHeader className="items-center">
              <Sparkles className="text-primary h-10 w-10 mb-3" />
              <CardTitle>1. Analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                Unsere KI verarbeitet deine Antworten in Echtzeit und erkennt Muster und Persönlichkeitsmerkmale ohne private Daten zu speichern.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4 border-t-4 border-t-primary">
            <CardHeader className="items-center">
              <Zap className="text-primary h-10 w-10 mb-3" />
              <CardTitle>2. Anpassung</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                Basierend auf deinen Antworten generiert die KI personalisierte Vorschläge und Erweiterungen, die dein Quiz-Erlebnis verbessern.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4 border-t-4 border-t-primary">
            <CardHeader className="items-center">
              <Users className="text-primary h-10 w-10 mb-3" />
              <CardTitle>3. Verbindung</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                Die KI hilft dabei, tiefere Verbindungen zu schaffen, indem sie relevante Fragen und Erkenntnisse basierend auf deinem Freundeskreis vorschlägt.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-6 py-16 px-4 sm:px-8 my-8 bg-gradient-to-r from-primary/10 to-transparent rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-4 text-left md:max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Du brauchst eine eigene Website <span className="text-primary">oder Webanwendung?</span>
            </h2>
            <p className="text-sm sm:text-base text-foreground/90">
              Bei <span className="font-semibold">Rodriguez-web.de</span> erstelle ich maßgeschneiderte Webseiten und interaktive Anwendungen wie dieses Quiz! Von der Konzeption bis zur Umsetzung - alles aus einer Hand.
            </p>
            <ul className="text-sm sm:text-base space-y-2 pl-5 list-disc text-foreground/80">
              <li>Moderne Webdesigns mit Fokus auf Mobile-First</li>
              <li>Interaktive Web-Apps mit reaktiven Elementen</li>
              <li>KI-Integration und innovative Funktionen</li>
            </ul>
          </div>
          <div className="flex-shrink-0">
            <Link href="https://rodriguez-web.de" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base px-6 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Zap className="mr-2 h-5 w-5" />
                Entdecke Rodriguez-web.de
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
       <section className="pt-8">
         <Link href="/name">
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10">
             Bereit zu starten? Erstelle dein Quiz!
          </Button>
        </Link>
      </section>
    </div>
  );
}
