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
            const encodedData = btoa(JSON.stringify(dataToEncode));
            const baseUrl = `${window.location.origin}/share/${slug}`; 
            const fullShareUrl = `${baseUrl}?data=${encodeURIComponent(encodedData)}`;
            setShareUrlWithData(fullShareUrl);
            console.log('[Creator View] Generated shareUrlWithData:', fullShareUrl); 
          } catch (e) {
            console.error("Error loading creator quiz:", e);
            toast({ title: "Error Loading Your Quiz", description: "Could not load quiz data. It might be corrupted.", variant: "destructive", duration: 5000 });
            router.push('/');
          }
        } else {
          toast({ title: "Quiz Not Found", description: "Could not find your quiz data. Was it created in this browser?", variant: "destructive", duration: 5000 });
          router.push('/');
        }
        setIsLoading(false);
      } else if (quizDataFromUrl) {
        console.log('[Friend View] Full URL:', window.location.href);
        console.log('[Friend View] Extracted quizDataFromUrl:', quizDataFromUrl);
        try {
          const decodedDataString = atob(decodeURIComponent(quizDataFromUrl));
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
          toast({ title: "Invalid or Corrupted Quiz Link", description: e.message || "The quiz link appears to be invalid. Please ask your friend for a new one.", variant: "destructive", duration: 7000 });
          router.push('/');
        }
        setIsLoading(false);
      } else {
        toast({ title: "Quiz Link Incomplete", description: "This quiz link is missing data. Ask your friend for a new link or try creating your own quiz!", variant: "default", duration: 7000 });
        router.push('/');
        setIsLoading(false);
      }
    }
  }, [slug, router, toast, searchParams]);

  const copyToClipboard = () => {
    console.log('[Copy Action] Attempting to copy URL:', shareUrlWithData); 
    navigator.clipboard.writeText(shareUrlWithData).then(() => {
      setCopied(true);
      toast({ title: 'Copied to Clipboard!', description: 'Quiz link ready to be pasted.' });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast({ title: 'Copy Error', description: 'Failed to copy link automatically. Please copy it manually.', variant: 'destructive' });
    });
  };
  
  const handleFriendNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (friendName.trim().length < 2 || friendName.trim().length > 30) {
      toast({ title: "Invalid Name", description: "Name must be between 2 and 30 characters.", variant: "destructive" });
      return;
    }
    if (!quizDataForFriend) {
        toast({ title: "Quiz Load Error", description: "Quiz data not loaded. Please try the link again.", variant: "destructive" });
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

  const calculateAndFinalizeScore = async (currentAnswers: SubmittedAnswer[]) => {
    if (!quizDataForFriend) return;
    let score = 0;
    currentAnswers.forEach(friendAns => {
      const creatorAns = quizDataForFriend.creatorAnswers.find(ca => ca.questionId === friendAns.questionId);
      if (creatorAns && !friendAns.answer.startsWith('__SKIPPED_') && creatorAns.answer.trim().toLowerCase() === creatorAns.answer.trim().toLowerCase()) {
        score++;
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
        title: "Attempt Saved Online!",
        description: "Your score and answers have been saved to the leaderboard.",
        variant: "default", 
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving attempt to Firestore:", error);
      toast({
        title: "Online Save Failed",
        description: "Could not save your attempt to the online leaderboard. It's saved for this browser session.",
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
        toast({ title: 'Empty Answer', description: 'Please type an answer.', variant: 'destructive' });
        return;
      }
      
      const currentQ = quizDataForFriend.questionsUsed[currentQuestionIndex];
      const creatorAnsObj = quizDataForFriend.creatorAnswers.find(ca => ca.questionId === currentQ.id);

      if (!creatorAnsObj) {
        toast({ title: "Answer Error", description: "Creator's answer for this question is missing. Skipping.", variant: "destructive", duration: 4000 });
        handleSkipQuestion();
        return;
      }

      const creatorCorrectAnswer = creatorAnsObj.answer;
      const isCorrect = submittedAnswerValue.trim().toLowerCase() === creatorCorrectAnswer.trim().toLowerCase();
      
      const newAnswerRecord: SubmittedAnswer = { questionId: currentQ.id, answer: submittedAnswerValue.trim() };
      setFriendAnswers(prev => [...prev, newAnswerRecord]);
      
      setFeedbackDetailsForDisplay({ 
        friendAnswer: submittedAnswerValue.trim(), 
        creatorAnswer: creatorCorrectAnswer, 
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
        toast({ title: "Link not ready", description: "Please wait a moment for the share link to generate.", variant: "default"});
        return;
    }
    const text = `Can you guess my answers? Take ${creatorLocalStorageQuizData?.creatorName || 'my'} Friendship Finder quiz! ${shareUrlWithData}`;
    let url = '';
    switch (platform) {
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            break;
        case 'messenger':
            copyToClipboard();
            toast({ title: 'Link Copied!', description: 'Now paste it into your Messenger chat.' });
            window.open('https://www.messenger.com/', '_blank', 'noopener,noreferrer');
            return; 
        case 'email':
            url = `mailto:?subject=${encodeURIComponent(`My Friendship Finder Quiz for ${creatorLocalStorageQuizData?.creatorName || 'You'}`)}&body=${encodeURIComponent(text)}`;
            break;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
};

  if (isLoading || isCurrentUserCreator === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Verifying quiz link...</p>
      </div>
    );
  }

  if (isCurrentUserCreator && creatorLocalStorageQuizData) {
    return (
      <div className="flex justify-center items-start py-10 sm:py-16">
        <Card className="w-full max-w-xl shadow-xl border-2 border-primary/30">
          <CardHeader className="text-center pt-8">
            <Award className="mx-auto h-16 w-16 text-primary mb-3" />
            <CardTitle className="text-3xl sm:text-4xl font-bold">Your Quiz is Live!</CardTitle>
            <CardDescription className="text-md sm:text-lg pt-2 text-muted-foreground">
              Share this link with your friends and see who knows <span className="font-semibold text-foreground">{creatorLocalStorageQuizData.creatorName}</span> best.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 sm:px-8">
            <div className="space-y-2">
              <Label htmlFor="share-link" className="text-lg font-medium">Your Unique Quiz Link:</Label>
              <div className="flex items-center space-x-2">
                <Input id="share-link" type="text" value={shareUrlWithData} readOnly className="h-12 text-base bg-muted/50 flex-grow" aria-label="Shareable quiz link" />
                <Button variant="outline" size="lg" onClick={copyToClipboard} aria-label="Copy link" className="h-12">
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-3 pt-2">
                <p className="text-center text-md font-medium text-muted-foreground">Or share directly via:</p>
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
                    <Mail className="mr-2 h-5 w-5" /> Email
                </Button>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 pb-8 pt-4">
            <Button onClick={() => router.push(`/results/${slug}`)} variant="secondary" size="lg" className="w-full sm:w-auto text-lg py-3 h-auto">
              <BarChartBig className="mr-2 h-5 w-5" /> View Results
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full text-lg py-3 h-auto text-primary hover:text-primary/80">
                Create New Quiz
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
              <CardTitle className="text-3xl">It's <span className="text-primary">{quizDataForFriend.creatorName}'s</span> Quiz Time!</CardTitle>
              <CardDescription className="text-md pt-1">
                Ready to test how well you know {quizDataForFriend.creatorName}? Enter your name to begin.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleFriendNameSubmit}>
              <CardContent className="space-y-6 px-8">
                <div className="space-y-2">
                  <Label htmlFor="friend-name" className="text-lg font-semibold">Your Name</Label>
                  <div className="relative">
                    <Input
                      id="friend-name"
                      type="text"
                      placeholder="E.g., Jamie"
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
                  Let's Go! <Check className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      );
    }

    if (view === 'answering') {
      const questionsProcessedCount = feedbackDetailsForDisplay ? currentQuestionIndex + 1 : currentQuestionIndex;
      const progressPercentage = quizDataForFriend.questionsUsed.length > 0 
        ? (questionsProcessedCount / quizDataForFriend.questionsUsed.length) * 100 
        : 0;
      
      return (
        <div className="flex flex-col items-center space-y-8 py-8">
           <div className="w-full max-w-2xl space-y-3">
            <p className="text-center text-lg font-medium text-primary">
              You're taking {quizDataForFriend.creatorName}'s quiz, {friendName}!
            </p>
            <Progress value={progressPercentage} className="w-full h-4 rounded-full" />
            <p className="text-center text-md text-muted-foreground font-medium">
              Question {Math.min(currentQuestionIndex + 1, quizDataForFriend.questionsUsed.length)} of {quizDataForFriend.questionsUsed.length}
            </p>
          </div>
          {quizDataForFriend.questionsUsed.length > 0 && currentQuestionIndex < quizDataForFriend.questionsUsed.length ? (
            <QuestionDisplay
              question={quizDataForFriend.questionsUsed[currentQuestionIndex]}
              onSubmitOrNext={handleSubmitAnswerOrProceed}
              onSkipQuestion={handleSkipQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizDataForFriend.questionsUsed.length}
              creatorName={quizDataForFriend.creatorName}
              feedbackDetails={feedbackDetailsForDisplay}
              currentInputValue={currentFriendInputValue}
              onCurrentInputValueChange={setCurrentFriendInputValue}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)]">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Getting things ready...</p>
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
        scoreMessage = "This quiz had no questions! Odd...";
        ScoreIcon = HelpCircle;
      } else if (percentageScore === 100) {
        scoreMessage = `Perfect Score! You know ${quizDataForFriend.creatorName} like the back of your hand!`;
        ScoreIcon = Award;
      } else if (percentageScore >= 75) {
        scoreMessage = `Great job! You're a true friend to ${quizDataForFriend.creatorName}!`;
        ScoreIcon = ThumbsUp;
      } else if (percentageScore >= 50) {
        scoreMessage = `Not bad, ${friendName}! You know ${quizDataForFriend.creatorName} pretty well.`;
        ScoreIcon = Star;
      } else {
        scoreMessage = `Hmm, room for improvement! Time to catch up with ${quizDataForFriend.creatorName}?`;
        ScoreIcon = ThumbsDown;
      }

      return (
         <>
          {showConfetti && <Confetti recycle={false} numberOfPieces={400} gravity={0.15} initialVelocityY={20} onConfettiComplete={() => setShowConfetti(false)} />}
          <div className="flex justify-center items-center py-12">
              <Card className="w-full max-w-lg shadow-xl text-center border-2 border-primary/30">
              <CardHeader className="pt-8">
                  <ScoreIcon className={`mx-auto h-16 w-16 mb-4 ${percentageScore === 100 ? 'text-yellow-500' : 'text-primary'}`} />
                  <CardTitle className="text-3xl sm:text-4xl font-bold">Quiz Complete, {friendName}!</CardTitle>
                  <CardDescription className="text-md sm:text-lg pt-2">Here's how you did on {quizDataForFriend.creatorName}'s quiz:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                  <p className="text-5xl sm:text-7xl font-bold text-primary">
                    {friendScore} <span className="text-3xl sm:text-4xl text-muted-foreground">/ {totalQuestions}</span>
                  </p>
                  <p className="text-md sm:text-lg text-muted-foreground px-4">{scoreMessage}</p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
                  <Link href="/" className="w-full">
                    <Button size="lg" className="w-full text-lg py-7">
                        <Sparkles className="mr-2 h-5 w-5" /> Create Your Own Quiz!
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground pt-2">
                    Your score has been saved in this browser. {quizDataForFriend.creatorName} can see results from their device.
                  </p>
              </CardFooter>
              </Card>
          </div>
         </>
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <h2 className="text-2xl font-semibold text-muted-foreground">Loading Quiz...</h2>
        <p className="text-md mt-2">If this takes too long, the link might be invalid or there might be a network issue.</p>
      </div>
  );
}
