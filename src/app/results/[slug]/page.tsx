'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, TrendingUp, Home, Loader2, ShieldAlert, Users, Share2, Info } from 'lucide-react';
import type { QuizData, FriendAttempt } from '@/types'; 
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';
import Link from 'next/link';
import { firestore } from '@/lib/firebase'; 
import { doc, getDoc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'; 

interface FirestoreQuizDoc {
  id: string;
  creatorName: string;
  questionsUsed: string[]; 
  creatorAnswers: { questionId: string, answer: string }[];
  createdAt: Timestamp;
}

interface FirestoreAttemptDoc {
  quizId: string;
  friendName: string;
  score: number;
  totalQuestionsInQuiz: number;
  answers: { questionId: string, answer: string }[];
  submittedAt: Timestamp;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [quizBaseData, setQuizBaseData] = useState<Pick<FirestoreQuizDoc, 'creatorName' | 'questionsUsed' | 'id'> | null>(null);
  const [sortedAttempts, setSortedAttempts] = useState<FriendAttempt[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizedCreator, setIsAuthorizedCreator] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState<{width: number, height: number} | null>(null);

  useEffect(() => {
     if (typeof window !== 'undefined') {
      setWindowSize({width: window.innerWidth, height: window.innerHeight});
     }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      const fetchResultsData = async () => {
        setIsLoading(true);
        const storedCreatorName = localStorage.getItem('creatorName');

        try {
          const quizDocRef = doc(firestore, "quizzes", slug);
          const quizDocSnap = await getDoc(quizDocRef);

          if (!quizDocSnap.exists()) {
            toast({ title: "Quiz nicht gefunden", description: "Dieses Quiz existiert nicht oder wurde gelöscht.", variant: "destructive", duration: 7000 });
            setIsAuthorizedCreator(false); 
            setIsLoading(false);
            return;
          }

          const fetchedQuizData = quizDocSnap.data() as FirestoreQuizDoc;
          setQuizBaseData({
            id: fetchedQuizData.id,
            creatorName: fetchedQuizData.creatorName,
            questionsUsed: fetchedQuizData.questionsUsed 
          });

          const authorized = storedCreatorName === fetchedQuizData.creatorName;
          setIsAuthorizedCreator(authorized);

          if (!authorized) {
            setIsLoading(false);
            return; 
          }

          const attemptsQuery = query(
            collection(firestore, "attempts"), 
            where("quizId", "==", slug),
            orderBy("score", "desc")
          );
          const attemptsSnapshot = await getDocs(attemptsQuery);
          const attempts: FriendAttempt[] = attemptsSnapshot.docs.map(docSnap => {
            const data = docSnap.data() as FirestoreAttemptDoc;
            return {
              friendName: data.friendName,
              score: data.score,
              answers: data.answers, 
              totalQuestions: data.totalQuestionsInQuiz, 
              submittedAt: data.submittedAt.toDate() 
            };
          });
          setSortedAttempts(attempts);

          if (authorized && attempts.length > 0 && fetchedQuizData.questionsUsed.length > 0 && attempts[0].score === fetchedQuizData.questionsUsed.length) {
            const confettiKey = `confetti-perfect-score-${slug}`;
            const hasSeenConfetti = localStorage.getItem(confettiKey);
            if (!hasSeenConfetti) {
              setShowConfetti(true);
              localStorage.setItem(confettiKey, 'true');
            }
          }

        } catch (e: any) {
          console.error("Error loading quiz/attempts from Firestore:", e);
          toast({ title: "Fehler beim Laden der Ergebnisse", description: e.message || "Daten konnten nicht aus der Cloud geladen werden.", variant: "destructive", duration: 7000 });
        }
        setIsLoading(false);
      };

      fetchResultsData();
    }
  }, [slug, router, toast]); 

  if (isLoading || isAuthorizedCreator === null) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Die Zahlen werden ausgewertet...</p>
      </div>
    );
  }

  if (!isAuthorizedCreator) { 
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6">
        <ShieldAlert className="h-20 w-20 text-destructive mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Zugriff auf Bestenliste eingeschränkt</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Nur der Quiz-Ersteller, <span className="font-semibold text-foreground">{quizBaseData?.creatorName || 'diese Person'}</span>, kann die vollständige Bestenliste sehen. Wenn du das Quiz gemacht hast, hast du deine Punktzahl bereits gesehen!
        </p>
        <Link href="/">
          <Button size="lg" className="text-lg py-7 px-8">
            <Home className="mr-2 h-5 w-5" />
            Erstelle dein eigenes Freundschafts-Quiz
          </Button>
        </Link>
      </div>
    );
  }
  
  if (!quizBaseData || !quizBaseData.questionsUsed) { 
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6">
        <Info className="h-20 w-20 text-amber-500 mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Quiz-Daten unvollständig</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Die wesentlichen Informationen für dieses Quiz (wie Fragen oder Erstellername) konnten nicht aus der Cloud geladen werden. Ergebnisse können nicht angezeigt werden.
        </p>
         <Link href="/">
          <Button size="lg" className="text-lg py-7 px-8">
            <Home className="mr-2 h-5 w-5" />
            Zurück zur Startseite
          </Button>
        </Link>
      </div>
    );
  }


  return (
    <>
      {showConfetti && windowSize && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} gravity={0.1} onConfettiComplete={() => setShowConfetti(false)} />}
      <div className="flex flex-col items-center space-y-8 py-8 sm:py-12">
        <Card className="w-full max-w-3xl shadow-xl border-2 border-primary/20">
          <CardHeader className="text-center pt-8">
            <TrendingUp className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-3xl sm:text-4xl font-bold">Quiz-Ergebnis-Dashboard</CardTitle>
            <CardDescription className="text-lg sm:text-xl pt-2 text-muted-foreground">
              Sieh, wer <span className="font-semibold text-foreground">{quizBaseData.creatorName}</span> am besten kennt!
              <span className="block text-sm mt-1">(Zeigt Versuche von jedem, der deinen Teilen-Link verwendet hat)</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {sortedAttempts.length > 0 && quizBaseData.questionsUsed.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[80px] text-center text-lg font-semibold">Rang</TableHead>
                      <TableHead className="text-lg font-semibold">Name des Freundes</TableHead>
                      <TableHead className="text-right text-lg font-semibold">Punktzahl</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAttempts.map((attempt, index) => (
                      <TableRow key={attempt.friendName + index + attempt.score} className={index === 0 ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-muted/30'}>
                        <TableCell className="font-bold text-xl text-center py-4">
                          {index === 0 ? <Crown className="h-8 w-8 text-yellow-500 inline-block" /> : index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-lg py-4">{attempt.friendName}</TableCell>
                        <TableCell className="text-right font-bold text-xl py-4 text-primary">
                          {attempt.score} / {quizBaseData.questionsUsed.length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Users className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="text-xl font-semibold text-muted-foreground">Noch keine Versuche aufgezeichnet.</p>
                <p className="text-md">Teile deinen Quiz-Link, um Ergebnisse auf die Tafel zu bekommen!</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 py-6 border-t mt-4">
            <Link href={`/share/${slug}`} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-lg py-3 h-auto border-primary text-primary hover:bg-primary/10">
                  <Share2 className="mr-2 h-5 w-5" /> Quiz erneut teilen
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg py-3 h-auto">
                <Home className="mr-2 h-5 w-5" /> Neues Quiz erstellen
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
