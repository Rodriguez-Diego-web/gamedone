'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Share2, Copy, MessageSquareText, Mail, User, Check, BarChartBig, Loader2, Users, Award, Star, ThumbsUp, ThumbsDown, Sparkles, HelpCircle } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import type { QuizData, SubmittedAnswer, Question } from '@/types';
import { DUMMY_QUESTIONS } from '@/data/questions';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import { Progress } from '@/components/ui/progress';
import Confetti from 'react-confetti';
import Link from 'next/link';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { normalizeAnswer, calculateLevenshteinDistance } from '@/lib/string-utils';

const isCreatorLocalStorage = (slug: string, currentCreatorName: string | undefined): boolean => {
  if (typeof window === 'undefined' || !currentCreatorName) return false;
  const quizDataString = localStorage.getItem(`quiz-${slug}`);
  if (!quizDataString) return false;
  try {
    const quizData: Partial<QuizData> = JSON.parse(quizDataString);
    return quizData.creatorName === currentCreatorName;
  } catch (e) {
    return false;
  }
};

const reconstructQuestions = (questionIdsAndAnswers: Array<{ qid: string; a: string }>, creatorName: string): { questions: Question[], creatorAnswers: SubmittedAnswer[] } => {
  const questions: Question[] = [];
  const creatorAnswers: SubmittedAnswer[] = [];

  questionIdsAndAnswers.forEach(item => {
    const baseQuestion = DUMMY_QUESTIONS.find(q => q.id === item.qid);
    if (baseQuestion) {
      questions.push(baseQuestion); 
      creatorAnswers.push({ questionId: item.qid, answer: item.a });
    } else {
      questions.push({ id: item.qid, text: () => `Error: Question ${item.qid} not found.`, answerPlaceholder: 'Error' });
      creatorAnswers.push({ questionId: item.qid, answer: item.a }); 
    }
  });
  return { questions, creatorAnswers };
};

interface EncodedQuizData {
  cn: string; 
  qa: Array<{ qid: string; a: string }>; 
}

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [quizDataForFriend, setQuizDataForFriend] = useState<Omit<QuizData, 'friendAttempts' | 'id'> & { questionsUsed: Question[] } | null>(null);
  const [creatorLocalStorageQuizData, setCreatorLocalStorageQuizData] = useState<QuizData | null>(null); 

  const [isCurrentUserCreator, setIsCurrentUserCreator] = useState<boolean | null>(null);
  const [shareUrlWithData, setShareUrlWithData] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [friendName, setFriendName] = useState('');
  const [friendAnswers, setFriendAnswers] = useState<SubmittedAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [view, setView] = useState<'nameInput' | 'answering' | 'score'>('nameInput');
  const [friendScore, setFriendScore] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const [currentFriendInputValue, setCurrentFriendInputValue] = useState('');
  const [feedbackDetailsForDisplay, setFeedbackDetailsForDisplay] = useState<{ friendAnswer: string, creatorAnswer: string, isCorrect: boolean } | null>(null);

  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<string | null>(null);

  console.log(
    '[SharePage Render Cycle] View:', view,
    '| isLoading:', isLoading,
    '| isLoadingOptions:', isLoadingOptions,
    '| mcqOptions.length:', mcqOptions.length,
    '| QData loaded:', !!quizDataForFriend,
    '| Current QIndex:', currentQuestionIndex
  );

  useEffect(() => {
    if (view === 'score' && quizDataForFriend) {
      setShowConfetti(true);
      // Das Konfetti stoppt von selbst, da recycle={false} wahrscheinlich in der Komponente gesetzt ist.
      // Falls es explizit nach einer Zeit ausgeblendet werden soll:
      // const timer = setTimeout(() => setShowConfetti(false), 10000); // z.B. nach 10 Sekunden
      // return () => clearTimeout(timer);
    }
  }, [view, quizDataForFriend, setShowConfetti]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localCreatorName = localStorage.getItem('creatorName') ?? undefined; 
      const isCreator = isCreatorLocalStorage(slug, localCreatorName);
      setIsCurrentUserCreator(isCreator);
      
      const quizDataFromUrl = searchParams.get('data');

      if (isCreator) {
        const storedQuizDataString = localStorage.getItem(`quiz-${slug}`);
        if (storedQuizDataString) {
          try {
            const parsedQuizData: QuizData = JSON.parse(storedQuizDataString);
             if (!parsedQuizData.creatorName || !parsedQuizData.creatorAnswers || !parsedQuizData.questionsUsed) { 
                throw new Error("Invalid quiz data structure in localStorage for creator");
             }
            setCreatorLocalStorageQuizData(parsedQuizData);

            const dataToEncode: EncodedQuizData = {
              cn: parsedQuizData.creatorName,
              qa: parsedQuizData.creatorAnswers.map(ans => ({ qid: ans.questionId, a: ans.answer })),
            };
            const jsonString = JSON.stringify(dataToEncode);
            const uint8Array = new TextEncoder().encode(jsonString);
            let binaryString = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binaryString += String.fromCharCode(uint8Array[i]);
            }
            const encodedData = btoa(binaryString);
            const baseUrl = `${window.location.origin}/share/${slug}`; 
            const fullShareUrl = `${baseUrl}?data=${encodeURIComponent(encodedData)}`;
            setShareUrlWithData(fullShareUrl);
            console.log('[Erstelleransicht] Generierter shareUrlWithData:', fullShareUrl); 
          } catch (e) {
            console.error("Fehler beim Laden des Quiz des Erstellers:", e);
            toast({ title: "Fehler beim Laden deines Quiz", description: "Quiz-Daten konnten nicht geladen werden. Sie könnten beschädigt sein.", variant: "destructive", duration: 5000 });
            router.push('/');
          }
        } else {
          toast({ title: "Quiz nicht gefunden", description: "Deine Quiz-Daten konnten nicht gefunden werden. Wurde es in diesem Browser erstellt?", variant: "destructive", duration: 5000 });
          router.push('/');
        }
        setIsLoading(false);
      } else if (quizDataFromUrl) {
        try {
          const base64DecodedBinaryString = atob(decodeURIComponent(quizDataFromUrl));
          const uint8Array = new Uint8Array(base64DecodedBinaryString.length);
          for (let i = 0; i < base64DecodedBinaryString.length; i++) {
            uint8Array[i] = base64DecodedBinaryString.charCodeAt(i);
          }
          const decodedDataString = new TextDecoder().decode(uint8Array);
          const decodedQuizData: EncodedQuizData = JSON.parse(decodedDataString);
          if (!decodedQuizData.cn || !decodedQuizData.qa) {
            throw new Error("Decoded quiz data is missing essential fields.");
          }

          const { questions: reconstructedQs, creatorAnswers: reconstructedCreatorAnswers } = reconstructQuestions(decodedQuizData.qa, decodedQuizData.cn);
          
          if (reconstructedQs.length === 0) {
            throw new Error("No questions could be reconstructed from the quiz data.");
          }

          const friendQuizInstance = {
            creatorName: decodedQuizData.cn,
            creatorAnswers: reconstructedCreatorAnswers,
            questionsUsed: reconstructedQs,
          };
          setQuizDataForFriend(friendQuizInstance);
          setView('nameInput'); 
        } catch (e: any) {
          console.error("Error processing quiz link:", e);
          toast({ title: "Ungültiger oder beschädigter Quiz-Link", description: e.message || "Der Quiz-Link scheint ungültig zu sein. Bitte frage deinen Freund nach einem neuen.", variant: "destructive", duration: 7000 });
          router.push('/');
        }
        setIsLoading(false);
      } else {
        toast({ title: "Quiz-Link unvollständig", description: "Diesem Quiz-Link fehlen Daten. Bitte deinen Freund um einen neuen Link oder versuche, dein eigenes Quiz zu erstellen!", variant: "default", duration: 7000 });
        router.push('/');
        setIsLoading(false);
      }
    }
  }, [slug, router, toast, searchParams]);

  useEffect(() => {
    if (view === 'answering' && quizDataForFriend && quizDataForFriend.questionsUsed[currentQuestionIndex]) {
      console.log('[MCQ useEffect] Triggered. View:', view, 'CurrentQIndex:', currentQuestionIndex);
      const fetchOptions = async () => {
        console.log('[fetchOptions] Starting to fetch options.');
        setIsLoadingOptions(true);
        setMcqOptions([]); 
        setCurrentFriendInputValue('');

        const currentQ = quizDataForFriend.questionsUsed[currentQuestionIndex];
        const creatorNameStr = quizDataForFriend.creatorName || "Der Ersteller";
        
        let questionTextForApi: string;
        if (typeof currentQ.text === 'function') {
          questionTextForApi = currentQ.text(creatorNameStr); 
        } else {
          questionTextForApi = currentQ.text as string; 
        }

        let correctAnswer = quizDataForFriend.creatorAnswers[currentQuestionIndex]?.answer || '';
        if (correctAnswer.includes('||')) {
          correctAnswer = correctAnswer.split('||')[0].trim();
        }

        console.log('[fetchOptions] About to call API. Question:', questionTextForApi, 'CorrectAnswer:', correctAnswer);
        try {
          const response = await fetch('/api/generate-options', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: questionTextForApi, correctAnswer }),
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            throw new Error(`API error: ${response.status} ${response.statusText}. ${errorData.error || ''}`);
          }
          const data = await response.json();
          if (data.options && Array.isArray(data.options)) {
            setMcqOptions(data.options);
            console.log('[fetchOptions] Successfully fetched and set options:', data.options);
          } else {
            throw new Error('No valid options array returned from API');
          }
        } catch (error: any) {
          console.error('[fetchOptions] Error fetching options:', error);
          const fallbackOpts = [correctAnswer, "Konnte Optionen nicht laden A", "Konnte Optionen nicht laden B", "Konnte Optionen nicht laden C"].filter(Boolean);
          setMcqOptions(fallbackOpts);
          console.log('[fetchOptions] Fallback options set:', fallbackOpts);
          toast({ title: 'Fehler beim Laden der Antwortoptionen', description: error.message || 'Bitte versuche es später erneut.', variant: 'destructive' });
        } finally {
          console.log('[fetchOptions] Setting isLoadingOptions to false.');
          setIsLoadingOptions(false);
        }
      };
      fetchOptions();
    }
  }, [view, currentQuestionIndex, quizDataForFriend, friendName, toast]);

  const copyToClipboard = () => {
    console.log('[Kopieraktion] Versuch, URL zu kopieren:', shareUrlWithData); 
    navigator.clipboard.writeText(shareUrlWithData).then(() => {
      setCopied(true);
      toast({ title: 'In Zwischenablage kopiert!', description: 'Quiz-Link ist bereit zum Einfügen.' });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast({ title: 'Kopierfehler', description: 'Link konnte nicht automatisch kopiert werden. Bitte kopiere ihn manuell.', variant: 'destructive' });
    });
  };
  
  const handleFriendNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (friendName.trim().length < 2 || friendName.trim().length > 30) {
      toast({ title: "Ungültiger Name", description: "Der Name muss zwischen 2 und 30 Zeichen lang sein.", variant: "destructive" });
      return;
    }
    if (!quizDataForFriend) {
        toast({ title: "Fehler beim Laden des Quiz", description: "Quiz-Daten nicht geladen. Bitte versuche den Link erneut.", variant: "destructive" });
        return;
    }
    localStorage.setItem(`friendName-${slug}`, friendName.trim()); 
    setView('answering');
  };

  useEffect(() => { 
    if (view === 'nameInput' && slug) {
      const savedFriendName = localStorage.getItem(`friendName-${slug}`);
      if (savedFriendName) {
        setFriendName(savedFriendName);
      }
    }
  }, [view, slug]);

  const isAnswerSimilar = (friendAnswerRaw: string, creatorAnswersRaw: string): { similar: boolean; matchedCreatorAnswer: string } => {
    const normalizedFriendAnswer = normalizeAnswer(friendAnswerRaw);
    const creatorPossibleAnswers = creatorAnswersRaw.split('||').map(ans => ans.trim()).filter(ans => ans.length > 0);

    if (creatorPossibleAnswers.length === 0) {
        // Edge case: creator provided empty or only '||' answers.
        // Consider it a match if the friend also provided an empty normalized answer.
        const isFriendAnsEmpty = normalizedFriendAnswer === '';
        return { similar: isFriendAnsEmpty, matchedCreatorAnswer: creatorAnswersRaw }; 
    }

    for (const singleCreatorAnswer of creatorPossibleAnswers) {
      const normalizedCreatorAnswer = normalizeAnswer(singleCreatorAnswer);
  
      if (normalizedFriendAnswer === normalizedCreatorAnswer) {
        return { similar: true, matchedCreatorAnswer: singleCreatorAnswer }; // Exact match after normalization
      }
  
      const distance = calculateLevenshteinDistance(normalizedFriendAnswer, normalizedCreatorAnswer);
      const maxLength = Math.max(normalizedFriendAnswer.length, normalizedCreatorAnswer.length);
      let threshold = 0;
  
      if (maxLength === 0) { // Handles case where both normalized strings are empty
        return { similar: true, matchedCreatorAnswer: singleCreatorAnswer };
      } else if (maxLength <= 3) {
        threshold = 0;
      } else if (maxLength <= 6) { // 4-6 characters
        threshold = 1;
      } else if (maxLength <= 10) { // 7-10 characters
        threshold = 2;
      } else { // >10 characters
        threshold = 3;
      }
      
      if (distance <= threshold) {
        return { similar: true, matchedCreatorAnswer: singleCreatorAnswer };
      }
    }
    // If no match found, return false. For feedback, show the *first* creator answer option.
    return { similar: false, matchedCreatorAnswer: creatorPossibleAnswers[0] || creatorAnswersRaw };
  };

  const calculateAndFinalizeScore = async (currentAnswers: SubmittedAnswer[]) => {
    if (!quizDataForFriend) return;
    let score = 0;
    currentAnswers.forEach(friendAns => {
      const creatorAnsObj = quizDataForFriend.creatorAnswers.find(ca => ca.questionId === friendAns.questionId);
      if (creatorAnsObj && !friendAns.answer.startsWith('__SKIPPED_')) {
        const similarityResult = isAnswerSimilar(friendAns.answer, creatorAnsObj.answer);
        if (similarityResult.similar) {
          score++;
        }
      }
    });
    setFriendScore(score);

    const friendAttemptData = { friendName: friendName.trim(), answers: currentAnswers, score, date: new Date().toISOString() };
    const friendAttemptsKey = `friend_attempts_for_quiz_${slug}`;
    const existingAttemptsString = localStorage.getItem(friendAttemptsKey);
    let attempts = [];
    if (existingAttemptsString) {
        try {
            attempts = JSON.parse(existingAttemptsString);
        } catch (e) { /* ignore parsing error, start fresh */ }
    }
    attempts.push(friendAttemptData);
    localStorage.setItem(friendAttemptsKey, JSON.stringify(attempts));

    const attemptDocData = {
      quizId: slug, 
      friendName: friendName.trim(),
      score: score,
      totalQuestionsInQuiz: quizDataForFriend.questionsUsed.length,
      answers: currentAnswers.map(a => ({ questionId: a.questionId, answer: a.answer })), 
      submittedAt: serverTimestamp(),
    };

    try {
      const attemptsCollectionRef = collection(firestore, "attempts");
      await addDoc(attemptsCollectionRef, attemptDocData);
      toast({
        title: "Versuch online gespeichert!",
        description: "Dein Punktestand und deine Antworten wurden in der Bestenliste gespeichert.",
        variant: "default", 
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving attempt to Firestore:", error);
      toast({
        title: "Online-Speichern fehlgeschlagen",
        description: "Dein Versuch konnte nicht in der Online-Bestenliste gespeichert werden. Er wurde für diese Browser-Sitzung gespeichert.",
        variant: "destructive",
        duration: 5000,
      });
    }

    if (score === quizDataForFriend.questionsUsed.length && quizDataForFriend.questionsUsed.length > 0) {
      setShowConfetti(true);
    }
    setView('score');
  };

  const handleSubmitAnswerOrProceed = (submittedAnswerValue?: string) => {
    if (!quizDataForFriend) return;

    if (feedbackDetailsForDisplay !== null) { 
      setFeedbackDetailsForDisplay(null);
      setCurrentFriendInputValue('');
      
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex >= quizDataForFriend.questionsUsed.length) {
        calculateAndFinalizeScore(friendAnswers);
      } else {
        setCurrentQuestionIndex(nextQuestionIndex);
      }
    } else { 
      if (submittedAnswerValue === undefined || submittedAnswerValue.trim() === '') {
        toast({ title: 'Leere Antwort', description: 'Bitte gib eine Antwort ein.', variant: 'destructive' });
        return;
      }
      
      const currentQ = quizDataForFriend.questionsUsed[currentQuestionIndex];
      const creatorAnsObj = quizDataForFriend.creatorAnswers.find(ca => ca.questionId === currentQ.id);

      if (!creatorAnsObj) {
        toast({ title: "Antwortfehler", description: "Die Antwort des Erstellers für diese Frage fehlt. Wird übersprungen.", variant: "destructive", duration: 4000 });
        handleSkipQuestion();
        return;
      }

      const creatorAnswerOptions = creatorAnsObj.answer;
      const similarityResult = isAnswerSimilar(submittedAnswerValue, creatorAnswerOptions);
      const isCorrect = similarityResult.similar;
      const displayCreatorAnswer = similarityResult.matchedCreatorAnswer; // Use the matched or first answer for display
      
      const newAnswerRecord: SubmittedAnswer = { questionId: currentQ.id, answer: submittedAnswerValue.trim() };
      setFriendAnswers(prev => [...prev, newAnswerRecord]);
      
      setFeedbackDetailsForDisplay({ 
        friendAnswer: submittedAnswerValue.trim(), 
        creatorAnswer: displayCreatorAnswer, // Show the matched/first creator answer
        isCorrect 
      });
    }
  };

  const handleSkipQuestion = () => {
    if (feedbackDetailsForDisplay !== null || !quizDataForFriend) return;

    const currentQ = quizDataForFriend.questionsUsed[currentQuestionIndex];
    const skippedAnswerRecord: SubmittedAnswer = { questionId: currentQ.id, answer: `__SKIPPED_${Date.now()}__` };
    
    const updatedAnswers = [...friendAnswers, skippedAnswerRecord];
    setFriendAnswers(updatedAnswers);
    setCurrentFriendInputValue(''); 
    
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex >= quizDataForFriend.questionsUsed.length) {
      calculateAndFinalizeScore(updatedAnswers);
    } else {
      setCurrentQuestionIndex(nextQuestionIndex);
    }
  };
  
  const handleShareIntent = (platform: 'whatsapp' | 'messenger' | 'email') => {
    if (!shareUrlWithData) {
        toast({ title: "Link nicht bereit", description: "Bitte warte einen Moment, bis der Teilen-Link generiert wurde.", variant: "default"});
        return;
    }
    const text = `Kannst du meine Antworten erraten? Mache ${creatorLocalStorageQuizData?.creatorName || 'mein'} Freundschaftsfinder-Quiz! ${shareUrlWithData}`;
    let url = '';
    switch (platform) {
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            break;
        case 'messenger':
            copyToClipboard();
            toast({ title: 'Link kopiert!', description: 'Füge ihn jetzt in deinen Messenger-Chat ein.' });
            window.open('https://www.messenger.com/', '_blank', 'noopener,noreferrer');
            return; 
        case 'email':
            url = `mailto:?subject=${encodeURIComponent(`Mein Freundschaftsfinder-Quiz für ${creatorLocalStorageQuizData?.creatorName || 'dich'}`)}&body=${encodeURIComponent(text)}`;
            break;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
};

  const handleMcqAnswerSelection = (option: string) => {
    setSelectedMcqAnswer(option);
  };

  if (isLoading || isCurrentUserCreator === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Quiz-Link wird überprüft...</p>
      </div>
    );
  }

  if (isCurrentUserCreator && creatorLocalStorageQuizData) {
    return (
      <div className="flex justify-center items-start py-10 sm:py-16">
        <Card className="w-full max-w-xl shadow-xl border-2 border-primary/30">
          <CardHeader className="text-center pt-8">
            <Award className="mx-auto h-16 w-16 text-primary mb-3" />
            <CardTitle className="text-3xl sm:text-4xl font-bold">Dein Quiz ist Live!</CardTitle>
            <CardDescription className="text-md sm:text-lg pt-2 text-muted-foreground">
              Teile diesen Link mit deinen Freunden und finde heraus, wer <span className="font-semibold text-foreground">{creatorLocalStorageQuizData.creatorName}</span> am besten kennt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 sm:px-8">
            <div className="space-y-2">
              <Label htmlFor="share-link" className="text-lg font-medium">Dein einzigartiger Quiz-Link:</Label>
              <div className="flex items-center space-x-2">
                <Input id="share-link" type="text" value={shareUrlWithData} readOnly className="h-12 text-base bg-muted/50 flex-grow" aria-label="Teilbarer Quiz-Link" />
                <Button variant="outline" size="lg" onClick={copyToClipboard} aria-label="Link kopieren" className="h-12">
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  <span className="ml-2">{copied ? 'Kopiert!' : 'Kopieren'}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-3 pt-2">
                <p className="text-center text-md font-medium text-muted-foreground">Oder direkt teilen über:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" size="lg" className="h-12 border-green-500 text-green-600 hover:bg-green-500/10" onClick={() => handleShareIntent('whatsapp')}>
                    <MessageSquareText className="mr-2 h-5 w-5" /> WhatsApp
                </Button>
                <Button variant="outline" size="lg" className="h-12 border-blue-600 text-blue-700 hover:bg-blue-600/10" onClick={() => handleShareIntent('messenger')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mr-2 h-5 w-5" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M0 7.75C0 3.473 3.473 0 7.75 0S15.5 3.473 15.5 7.75c0 4.002-3.005 7.293-6.902 7.672L6.08 16.353V13.57a.5.5 0 0 0-.325-.466C2.436 12.64 0 10.395 0 7.75zm2.37.045a.5.5 0 0 1 .5-.5h10.26a.5.5 0 0 1 .5.5v.01a.5.5 0 0 1-.5.5H2.87a.5.5 0 0 1-.5-.5v-.01zm2.083 2.063a.5.5 0 0 1 .5-.5h6.104a.5.5 0 0 1 .5.5v.01a.5.5 0 0 1-.5.5H4.953a.5.5 0 0 1-.5-.5v-.01zM4.453 3.62a.5.5 0 0 1 .5-.5H11.05a.5.5 0 0 1 .5.5v.01a.5.5 0 0 1-.5.5H4.953a.5.5 0 0 1-.5-.5v-.01z"/>
                    </svg>
                    Messenger
                </Button>
                <Button variant="outline" size="lg" className="h-12 border-gray-500 text-gray-600 hover:bg-gray-500/10" onClick={() => handleShareIntent('email')}>
                    <Mail className="mr-2 h-5 w-5" /> E-Mail
                </Button>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 pb-8 pt-4">
            <Button onClick={() => router.push(`/results/${slug}`)} variant="secondary" size="lg" className="w-full sm:w-auto text-lg py-3 h-auto">
              <BarChartBig className="mr-2 h-5 w-5" /> Ergebnisse ansehen
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full text-lg py-3 h-auto text-primary hover:text-primary/80">
                Neues Quiz erstellen
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!isCurrentUserCreator && quizDataForFriend) {
    if (view === 'nameInput') {
      return (
        <div className="flex justify-center items-center py-12">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
               <Users className="mx-auto h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-3xl">Es ist <span className="text-primary">{quizDataForFriend.creatorName}s</span> Quiz-Zeit!</CardTitle>
              <CardDescription className="text-md pt-1">
                Bereit zu testen, wie gut du {quizDataForFriend.creatorName} kennst? Gib deinen Namen ein, um zu beginnen.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleFriendNameSubmit}>
              <CardContent className="space-y-6 px-8">
                <div className="space-y-2">
                  <Label htmlFor="friend-name" className="text-lg font-semibold">Dein Name</Label>
                  <div className="relative">
                    <Input
                      id="friend-name"
                      type="text"
                      placeholder="Z.B. Max"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={30}
                      className="text-lg h-14 pl-4 pr-10"
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8">
                <Button type="submit" className="w-full text-lg py-7">
                  Los geht's! <Check className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      );
    }

    if (view === 'answering') {
      if (!quizDataForFriend || !quizDataForFriend.questionsUsed[currentQuestionIndex]) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Quiz-Daten werden geladen...</p>
          </div>
        );
      }

      const questionsProcessedCount = feedbackDetailsForDisplay ? currentQuestionIndex + 1 : currentQuestionIndex;
      const progressPercentage = quizDataForFriend.questionsUsed.length > 0 
        ? (questionsProcessedCount / quizDataForFriend.questionsUsed.length) * 100 
        : 0;
      
      return (
        <div className="flex flex-col items-center space-y-8 py-8 w-full px-4"> 
           <div className="w-full max-w-2xl space-y-3">
            <p className="text-center text-lg font-medium text-primary">
              Du machst gerade {quizDataForFriend.creatorName}s Quiz, {friendName}!
            </p>
            <Progress value={progressPercentage} className="w-full h-4 rounded-full" />
            <p className="text-center text-md text-muted-foreground font-medium">
              Frage {Math.min(currentQuestionIndex + 1, quizDataForFriend.questionsUsed.length)} von {quizDataForFriend.questionsUsed.length}
            </p>
          </div>

          {quizDataForFriend.questionsUsed.length > 0 && currentQuestionIndex < quizDataForFriend.questionsUsed.length ? (
            <Card className="w-full max-w-2xl mt-4"> 
              <CardHeader>
                <CardTitle>Frage {currentQuestionIndex + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <QuestionDisplay
                  question={quizDataForFriend.questionsUsed[currentQuestionIndex]}
                  creatorName={quizDataForFriend.creatorName || "Der Ersteller"}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={quizDataForFriend.questionsUsed.length}
                  onSubmitOrNext={handleSubmitAnswerOrProceed}
                  onSkipQuestion={() => { console.log('Skip in MCQ mode - not implemented'); }}
                  currentInputValue={currentFriendInputValue}
                  onCurrentInputValueChange={setCurrentFriendInputValue}
                  feedbackDetails={feedbackDetailsForDisplay}
                  isMcqMode={true}
                />
                {isLoadingOptions ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Lade Antwortoptionen...</p>
                  </div>
                ) : mcqOptions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {mcqOptions.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedMcqAnswer === option ? "default" : "outline"}
                        onClick={() => handleMcqAnswerSelection(option)}
                        className="text-sm sm:text-base p-4 sm:p-5 h-auto whitespace-normal break-words justify-start text-left leading-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        disabled={feedbackDetailsForDisplay !== null} // Disable after an answer has been submitted and feedback is shown
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground mt-4 p-4 border border-dashed rounded-md">
                    <p>Antwortoptionen konnten nicht geladen werden oder sind für diese Frage nicht verfügbar.</p>
                  </div>
                )}

                {feedbackDetailsForDisplay && (
                  <Card className="mt-6 bg-muted/50 p-4 space-y-3">
                    <CardTitle className="text-lg">Feedback</CardTitle>
                    <div>
                      <p className="text-sm font-medium">Deine Auswahl:</p>
                      <p className="text-base font-semibold">{feedbackDetailsForDisplay.friendAnswer}</p>
                    </div>
                    {!feedbackDetailsForDisplay.isCorrect && (
                      <div>
                        <p className="text-sm font-medium">Korrekte Antwort vom Ersteller:</p>
                        <p className="text-base font-semibold text-blue-600">{feedbackDetailsForDisplay.creatorAnswer}</p>
                      </div>
                    )}
                    <div className="flex items-center">
                      {feedbackDetailsForDisplay.isCorrect ? <ThumbsUp className="h-5 w-5 text-green-600 mr-2" /> : <ThumbsDown className="h-5 w-5 text-red-600 mr-2" />}
                      <p className={`text-base font-semibold ${feedbackDetailsForDisplay.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {feedbackDetailsForDisplay.isCorrect ? "Richtig!" : "Leider nicht ganz..."}
                      </p>
                    </div>
                  </Card>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-center items-center pt-6">
                <Button 
                  onClick={() => handleSubmitAnswerOrProceed(selectedMcqAnswer || undefined)} 
                  disabled={
                    feedbackDetailsForDisplay === null && !selectedMcqAnswer // Disable only if in answering mode and no MCQ answer is selected
                  }
                  size="lg"
                  className="w-full sm:w-auto min-w-[180px]"
                >
                  {feedbackDetailsForDisplay 
                    ? (currentQuestionIndex < quizDataForFriend.questionsUsed.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen') 
                    : 'Antworten'}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Bereite Frage vor...</p>
            </div>
          )}
        </div>
      );
    }

    if (view === 'score') {
      const totalQuestions = quizDataForFriend.questionsUsed.length;
      const percentageScore = totalQuestions > 0 ? (friendScore / totalQuestions) * 100 : 0;
      let scoreMessage = "";
      let ScoreIcon = Star;

      if (totalQuestions === 0) {
        scoreMessage = "Dieses Quiz hatte keine Fragen! Seltsam...";
        ScoreIcon = HelpCircle;
      } else if (percentageScore === 100) {
        scoreMessage = `Perfekte Punktzahl! Du kennst ${quizDataForFriend.creatorName} wie deine Westentasche!`;
        ScoreIcon = Award;
      } else if (percentageScore >= 75) {
        scoreMessage = `Großartige Arbeit! Du bist ein wahrer Freund für ${quizDataForFriend.creatorName}!`;
        ScoreIcon = ThumbsUp;
      } else if (percentageScore >= 50) {
        scoreMessage = `Nicht schlecht, ${friendName}! Du kennst ${quizDataForFriend.creatorName} ziemlich gut.`;
        ScoreIcon = Star;
      } else {
        scoreMessage = `Hmm, Verbesserungspotenzial! Zeit, dich mit ${quizDataForFriend.creatorName} auszutauschen?`;
        ScoreIcon = ThumbsDown;
      }

      return (
         <>
          {showConfetti && <Confetti recycle={false} numberOfPieces={400} gravity={0.15} initialVelocityY={20} onConfettiComplete={() => setShowConfetti(false)} />}
          <div className="flex justify-center items-center py-12">
              <Card className="w-full max-w-lg shadow-xl text-center border-2 border-primary/30">
              <CardHeader className="pt-8">
                  <ScoreIcon className={`mx-auto h-16 w-16 mb-4 ${percentageScore === 100 ? 'text-yellow-500' : 'text-primary'}`} />
                  <CardTitle className="text-3xl sm:text-4xl font-bold">Quiz abgeschlossen, {friendName}!</CardTitle>
                  <CardDescription className="text-md sm:text-lg pt-2">So hast du bei {quizDataForFriend.creatorName}s Quiz abgeschnitten:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                  <p className="text-5xl sm:text-7xl font-bold text-primary">
                    {friendScore} <span className="text-3xl sm:text-4xl text-muted-foreground">/ {totalQuestions}</span>
                  </p>
                  <p className="text-md sm:text-lg text-muted-foreground px-4">{scoreMessage}</p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-center items-center pt-6">
                  <Link href="/" className="w-full">
                    <Button size="lg" className="w-full text-lg py-7">
                        <Sparkles className="mr-2 h-5 w-5" /> Erstelle dein eigenes Quiz!
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground pt-2">
                    Dein Ergebnis wurde in diesem Browser gespeichert. {quizDataForFriend.creatorName} kann die Ergebnisse auf seinem Gerät sehen.
                  </p>
              </CardFooter>
              </Card>
          </div>
         </>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8 px-4 flex flex-col items-center">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 0}
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
          numberOfPieces={400} // Increased for more celebration!
          gravity={0.15} // Adjusted for a slightly floatier effect
          initialVelocityX={{ min: -10, max: 10}}
          initialVelocityY={{ min: -15, max: 5}}
          className="!fixed !z-[9999]"
        />
      )}

      {isCurrentUserCreator && creatorLocalStorageQuizData && (
        <div className="flex justify-center items-start py-10 sm:py-16">
          <Card className="w-full max-w-xl shadow-xl border-2 border-primary/30">
            <CardHeader className="text-center pt-8">
              <Award className="mx-auto h-16 w-16 text-primary mb-3" />
              <CardTitle className="text-3xl sm:text-4xl font-bold">Dein Quiz ist Live!</CardTitle>
              <CardDescription className="text-md sm:text-lg pt-2 text-muted-foreground">
                Teile diesen Link mit deinen Freunden und finde heraus, wer <span className="font-semibold text-foreground">{creatorLocalStorageQuizData.creatorName}</span> am besten kennt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-6 sm:px-8">
              <div className="space-y-2">
                <Label htmlFor="share-link" className="text-lg font-medium">Dein einzigartiger Quiz-Link:</Label>
                <div className="flex items-center space-x-2">
                  <Input id="share-link" type="text" value={shareUrlWithData} readOnly className="h-12 text-base bg-muted/50 flex-grow" aria-label="Teilbarer Quiz-Link" />
                  <Button variant="outline" size="lg" onClick={copyToClipboard} aria-label="Link kopieren" className="h-12">
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                    <span className="ml-2">{copied ? 'Kopiert!' : 'Kopieren'}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                  <p className="text-center text-md font-medium text-muted-foreground">Oder direkt teilen über:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button variant="outline" size="lg" className="h-12 border-green-500 text-green-600 hover:bg-green-500/10" onClick={() => handleShareIntent('whatsapp')}>
                      <MessageSquareText className="mr-2 h-5 w-5" /> WhatsApp
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 border-blue-600 text-blue-700 hover:bg-blue-600/10" onClick={() => handleShareIntent('messenger')}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mr-2 h-5 w-5" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M0 7.75C0 3.473 3.473 0 7.75 0S15.5 3.473 15.5 7.75c0 4.002-3.005 7.293-6.902 7.672L6.08 16.353V13.57a.5.5 0 0 0-.325-.466C2.436 12.64 0 10.395 0 7.75zm2.37.045a.5.5 0 0 1 .5-.5h10.26a.5.5 0 0 1 .5.5v.01a.5.5 0 0 1-.5.5H2.87a.5.5 0 0 1-.5-.5v-.01zm2.083 2.063a.5.5 0 0 1 .5-.5h6.104a.5.5 0 0 1 .5.5v.01a.5.5 0 0 1-.5.5H4.953a.5.5 0 0 1-.5-.5v-.01zM4.453 3.62a.5.5 0 0 1 .5-.5H11.05a.5.5 0 0 1 .5.5v.01a.5.5 0 0 1-.5.5H4.953a.5.5 0 0 1-.5-.5v-.01z"/>
                      </svg>
                      Messenger
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 border-gray-500 text-gray-600 hover:bg-gray-500/10" onClick={() => handleShareIntent('email')}>
                      <Mail className="mr-2 h-5 w-5" /> E-Mail
                  </Button>
                  </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 pb-8 pt-4">
              <Button onClick={() => router.push(`/results/${slug}`)} variant="secondary" size="lg" className="w-full sm:w-auto text-lg py-3 h-auto">
                <BarChartBig className="mr-2 h-5 w-5" /> Ergebnisse ansehen
              </Button>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full text-lg py-3 h-auto text-primary hover:text-primary/80">
                  Neues Quiz erstellen
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
