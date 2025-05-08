'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DUMMY_QUESTIONS, getRandomQuestions } from '@/data/questions';
import type { Question, SubmittedAnswer, QuizData } from '@/types';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { generateSlug } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Info } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const TOTAL_QUESTIONS_TO_PICK = 9; 

export default function QuizBuilderPage() {
  const [creatorName, setCreatorName] = useState<string>('');
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [creatorAnswers, setCreatorAnswers] = useState<SubmittedAnswer[]>([]); 
  const [questionsUsed, setQuestionsUsed] = useState<Question[]>([]); 
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [internalInputValue, setInternalInputValue] = useState('');

  useEffect(() => {
    const nameFromStorage = localStorage.getItem('creatorName');
    if (!nameFromStorage) {
      toast({
        title: "Name nicht gefunden",
        description: "Bitte gib zuerst deinen Namen ein.",
        variant: "destructive",
        duration: 5000,
      });
      router.push('/name');
      return;
    }
    setCreatorName(nameFromStorage);
    
    // Check if there's a partially completed quiz in localStorage
    const partiallyCompletedQuiz = localStorage.getItem(`quiz-in-progress-${nameFromStorage}`);
    if (partiallyCompletedQuiz) {
        try {
            const { answers: savedAnswers, questions: savedQuestions, nextQuestionIndex: savedNextIndex } = JSON.parse(partiallyCompletedQuiz);
            if (savedAnswers && savedQuestions && typeof savedNextIndex === 'number') {
                setCreatorAnswers(savedAnswers);
                setQuestionsUsed(savedQuestions); // These are full Question objects if saved correctly
                setCurrentQuestionIndex(savedNextIndex);
                 // Make sure availableQuestions has enough questions, starting from where left off
                const combinedQuestions = [...savedQuestions];
                const additionalNeeded = Math.max(0, TOTAL_QUESTIONS_TO_PICK - savedQuestions.length + 5); // Add some buffer
                const newRandomQuestions = getRandomQuestions(DUMMY_QUESTIONS.length, nameFromStorage)
                                          .filter(q => !combinedQuestions.some(sq => sq.id === q.id)); // Ensure uniqueness

                let currentQuestionPool = [...savedQuestions];
                if(savedNextIndex < savedQuestions.length){
                    // User was on a question they already saw
                } else {
                     // User needs new questions
                    currentQuestionPool = [...savedQuestions, ...newRandomQuestions.slice(0, additionalNeeded)];
                }
                setAvailableQuestions(currentQuestionPool);

                toast({
                    title: "Willkommen zurück!",
                    description: "Quiz-Erstellung wird fortgesetzt.",
                    duration: 3000,
                });
            } else {
                 setAvailableQuestions(getRandomQuestions(DUMMY_QUESTIONS.length, nameFromStorage));
            }
        } catch (error) {
            console.error("Error parsing partially completed quiz:", error);
            localStorage.removeItem(`quiz-in-progress-${nameFromStorage}`); // Clear corrupted data
            setAvailableQuestions(getRandomQuestions(DUMMY_QUESTIONS.length, nameFromStorage));
        }
    } else {
        setAvailableQuestions(getRandomQuestions(DUMMY_QUESTIONS.length, nameFromStorage));
    }
    setIsLoading(false);
  }, [router, toast]);

  // Save progress to localStorage
  useEffect(() => {
    if (creatorName && creatorAnswers.length < TOTAL_QUESTIONS_TO_PICK && creatorAnswers.length > 0) {
      const progressData = {
        answers: creatorAnswers,
        questions: questionsUsed, // Save the questions used so far
        nextQuestionIndex: currentQuestionIndex,
      };
      localStorage.setItem(`quiz-in-progress-${creatorName}`, JSON.stringify(progressData));
    } else if (creatorName && creatorAnswers.length >= TOTAL_QUESTIONS_TO_PICK) {
      // Quiz is complete, remove in-progress data
      localStorage.removeItem(`quiz-in-progress-${creatorName}`);
    }
  }, [creatorAnswers, questionsUsed, currentQuestionIndex, creatorName]);


  const handleAnswerSubmit = async (answer: string) => {
    if (!availableQuestions[currentQuestionIndex]) return;

    const currentQuestion = availableQuestions[currentQuestionIndex];
    const newAnswer: SubmittedAnswer = { questionId: currentQuestion.id, answer };
    
    const updatedCreatorAnswers = [...creatorAnswers, newAnswer];
    setCreatorAnswers(updatedCreatorAnswers);
    
    // Only add to questionsUsed if it's not already there (e.g. from resuming)
    if (!questionsUsed.some(q => q.id === currentQuestion.id)) {
        setQuestionsUsed(prev => [...prev, currentQuestion]);
    } else {
        // If resuming and currentQuestion is already in questionsUsed, ensure it's up-to-date.
        // This typically shouldn't be an issue if availableQuestions is managed correctly.
    }

    setInternalInputValue(''); 

    if (updatedCreatorAnswers.length === TOTAL_QUESTIONS_TO_PICK) {
      const quizSlug = generateSlug();
      const finalQuestionsUsedObjects = questionsUsed.length === TOTAL_QUESTIONS_TO_PICK 
        ? questionsUsed 
        : availableQuestions.slice(0, TOTAL_QUESTIONS_TO_PICK);

      // Data for localStorage (keeps full Question objects in questionsUsed)
      const localQuizData: QuizData = {
        id: quizSlug,
        creatorName,
        creatorAnswers: updatedCreatorAnswers,
        questionsUsed: finalQuestionsUsedObjects, 
        friendAttempts: [],
      };

      // Prepare data for Firestore (maps questionsUsed to array of question IDs)
      const firestoreQuizDocData = {
        id: quizSlug,
        creatorName,
        creatorAnswers: updatedCreatorAnswers,
        questionsUsed: finalQuestionsUsedObjects.map(q => q.id), // Store only IDs
        createdAt: serverTimestamp(), // Add server timestamp
      };

      try {
        const quizDocRef = doc(firestore, "quizzes", quizSlug);
        await setDoc(quizDocRef, firestoreQuizDocData);
        toast({
          title: "Quiz in der Cloud gespeichert!",
          description: "Deine Quiz-Struktur ist jetzt sicher online gespeichert.",
          duration: 3000,
          variant: "default"
        });
      } catch (error) {
        console.error("Error saving quiz to Firestore:", error);
        toast({
          title: "Speichern in Firestore fehlgeschlagen",
          description: "Das Quiz konnte nicht in der Cloud gespeichert werden. Es ist vorerst lokal gespeichert.",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      localStorage.setItem(
        `quiz-${quizSlug}`,
        JSON.stringify(localQuizData) // Save local version with full question objects
      );
       localStorage.removeItem(`quiz-in-progress-${creatorName}`);

      toast({
        title: "Quiz erstellt!",
        description: "Dein Quiz ist bereit, geteilt zu werden.",
        duration: 5000,
      });
      router.push(`/share/${quizSlug}`);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      if (currentQuestionIndex + 1 >= availableQuestions.length && availableQuestions.length < DUMMY_QUESTIONS.length) {
         const newRandomQuestions = getRandomQuestions(5, creatorName)
                                      .filter(q => !availableQuestions.some(aq => aq.id === q.id)); // Ensure uniqueness
        setAvailableQuestions(prev => [...prev, ...newRandomQuestions]);
      }
    }
  };

  const handleSkipQuestion = () => {
    setInternalInputValue(''); 
    setCurrentQuestionIndex(prev => prev + 1);
    if (currentQuestionIndex + 1 >= availableQuestions.length && availableQuestions.length < DUMMY_QUESTIONS.length) {
        const newRandomQuestions = getRandomQuestions(5, creatorName)
                                      .filter(q => !availableQuestions.some(aq => aq.id === q.id));
        setAvailableQuestions(prev => [...prev, ...newRandomQuestions]);
    }
  };
  
  const progressPercentage = (creatorAnswers.length / TOTAL_QUESTIONS_TO_PICK) * 100;

  if (isLoading || !creatorName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Quiz-Setup wird geladen...</p>
      </div>
    );
  }
  
  if (availableQuestions.length === 0 && creatorAnswers.length < TOTAL_QUESTIONS_TO_PICK) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Deine Fragen werden vorbereitet...</p>
      </div>
    );
  }
  
  if (currentQuestionIndex >= availableQuestions.length && creatorAnswers.length < TOTAL_QUESTIONS_TO_PICK) {
     if(availableQuestions.length < DUMMY_QUESTIONS.length){ 
        const newRandomQuestions = getRandomQuestions(5, creatorName)
                                      .filter(q => !availableQuestions.some(aq => aq.id === q.id));
        setAvailableQuestions(prev => [...prev, ...newRandomQuestions]);
     } else {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] space-y-4 text-center p-4">
            <Info className="h-12 w-12 text-destructive mb-2"/>
            <p className="text-xl font-semibold text-destructive">Oops! Uns sind vorerst die einzigartigen Fragen ausgegangen.</p>
            <p className="text-md text-muted-foreground">Du hast {creatorAnswers.length} Fragen beantwortet. Wir empfehlen, ein Quiz mit dieser Anzahl zu erstellen oder die Seite zu aktualisieren, um es mit mehr Fragen zu versuchen.</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => router.refresh()} variant="outline">Aktualisieren versuchen</Button>
              {creatorAnswers.length > 0 && (
                 <Button onClick={async () => {
                     // Force finalize with current answers
                    const quizSlug = generateSlug();
                    const finalCreatorAnswers = creatorAnswers;
                    // questionsUsed state should contain the full Question objects
                    const finalQuestionsUsedObjects = questionsUsed; 

                    // Data for localStorage
                    const localQuizData: QuizData = {
                        id: quizSlug,
                        creatorName,
                        creatorAnswers: finalCreatorAnswers,
                        questionsUsed: finalQuestionsUsedObjects,
                        friendAttempts: [],
                    };

                    // Prepare data for Firestore
                    const firestoreQuizDocData = {
                        id: quizSlug,
                        creatorName,
                        creatorAnswers: finalCreatorAnswers,
                        questionsUsed: finalQuestionsUsedObjects.map(q => q.id),
                        createdAt: serverTimestamp(),
                    };

                    try {
                        const quizDocRef = doc(firestore, "quizzes", quizSlug);
                        await setDoc(quizDocRef, firestoreQuizDocData);
                        toast({
                            title: "Quiz in der Cloud gespeichert!",
                            description: "Deine Quiz-Struktur ist jetzt sicher online gespeichert.",
                            duration: 3000,
                            variant: "default"
                        });
                    } catch (error) {
                        console.error("Error saving quiz to Firestore (manual finalize):", error);
                        toast({
                            title: "Speichern in Firestore fehlgeschlagen",
                            description: "Das Quiz konnte nicht in der Cloud gespeichert werden. Es ist vorerst lokal gespeichert.",
                            variant: "destructive",
                            duration: 5000,
                        });
                    }

                    localStorage.setItem(`quiz-${quizSlug}`, JSON.stringify(localQuizData));
                    localStorage.removeItem(`quiz-in-progress-${creatorName}`);
                    toast({ 
                        title: "Quiz erstellt!",
                        description: "Dein Quiz (mit weniger Fragen) ist bereit zum Teilen.",
                        duration: 5000,
                     });
                    router.push(`/share/${quizSlug}`);
                 }}>
                    Quiz mit {creatorAnswers.length} Fragen abschließen
                 </Button>
              )}
            </div>
          </div>
        )
     }
  }
  
  if (creatorAnswers.length >= TOTAL_QUESTIONS_TO_PICK) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Dein großartiges Quiz wird abgeschlossen...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <div className="w-full max-w-2xl space-y-3">
        <p className="text-center text-lg font-medium text-primary">
          Hallo {creatorName}, lass uns deine Antworten festlegen!
        </p>
        <Progress value={progressPercentage} className="w-full h-4 rounded-full" /> {/* Increased height & rounded */}
        <p className="text-center text-md text-muted-foreground font-medium">
          Beantwortete Fragen: {creatorAnswers.length} von {TOTAL_QUESTIONS_TO_PICK}
        </p>
      </div>

      {availableQuestions[currentQuestionIndex] ? (
        <QuestionDisplay
          question={availableQuestions[currentQuestionIndex]}
          onSubmitAnswer={handleAnswerSubmit}
          onSkipQuestion={handleSkipQuestion}
          questionNumber={creatorAnswers.length + 1}
          totalQuestions={TOTAL_QUESTIONS_TO_PICK}
          creatorName={creatorName}
          currentInputValue={internalInputValue} 
          onCurrentInputValueChange={setInternalInputValue} 
        />
      ) : (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Die nächste Frage wird herbeigezaubert...</p>
         </div>
      )}
    </div>
  );
}
