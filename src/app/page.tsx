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
          <Button size="lg" className="text-xl px-10 py-7 shadow-lg hover:shadow-xl transition-shadow">
            <Sparkles className="mr-2 h-6 w-6" />
            Erstelle dein Quiz & finde es heraus!
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
