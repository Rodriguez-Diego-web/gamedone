'use client';

import React, { type ChangeEvent, useState, useEffect } from 'react';
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SkipForward, HelpCircle, Send, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: Question;
  onSkipQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  creatorName: string;
  onSubmitAnswer?: (answer: string) => void; 
  onSubmitOrNext?: (answer?: string) => void; 
  feedbackDetails?: { friendAnswer: string, creatorAnswer: string, isCorrect: boolean } | null;
  currentInputValue: string; 
  onCurrentInputValueChange: (value: string) => void;
  isMcqMode?: boolean;
}

export default function QuestionDisplay({
  question,
  onSubmitAnswer,
  onSubmitOrNext,
  onSkipQuestion,
  questionNumber,
  totalQuestions,
  creatorName,
  feedbackDetails = null, 
  currentInputValue,
  onCurrentInputValueChange,
  isMcqMode = false,
}: QuestionDisplayProps) {
  const { toast } = useToast();
  
  const isCreatorMode = !!onSubmitAnswer;
  const isFriendMode = !!onSubmitOrNext;
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onCurrentInputValueChange(e.target.value);
  };

  const handleSubmitClick = () => {
    if (isCreatorMode && onSubmitAnswer) {
      if (currentInputValue.trim() === '') {
        toast({
          title: 'Leere Antwort',
          description: 'Bitte gib eine Antwort ein, bevor du sie abschickst.',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }
      onSubmitAnswer(currentInputValue.trim());
      // Parent (QuizPage) will clear input: onCurrentInputValueChange('');
    } else if (isFriendMode && onSubmitOrNext) {
      if (!feedbackDetails) { 
        if (currentInputValue.trim() === '') {
          toast({
            title: 'Leere Antwort',
            description: 'Bitte gib eine Antwort ein.',
            variant: 'destructive',
            duration: 3000,
          });
          return;
        }
        onSubmitOrNext(currentInputValue.trim());
      } else { 
        onSubmitOrNext(); 
      }
    }
  };

  const isFeedbackModeForFriend = isFriendMode && feedbackDetails !== null;
  const displayValue = isFeedbackModeForFriend ? (feedbackDetails?.friendAnswer ?? '') : currentInputValue;

  return (
    <Card className="w-full max-w-2xl shadow-xl border-2 border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center font-semibold">
          <HelpCircle className="inline-block mr-2 h-7 w-7 text-primary relative -top-0.5" />
          Frage {questionNumber} <span className="text-muted-foreground text-lg">von</span> {totalQuestions}
        </CardTitle>
        <CardDescription className="text-center text-lg md:text-xl pt-3 leading-relaxed">
          {question.text(creatorName)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2 pb-5">
        {!isMcqMode && (
          <Input
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            placeholder={question.answerPlaceholder || 'Gib hier deine Antwort ein...'}
            className={cn(
              "text-lg h-14 px-4 py-3 shadow-inner", 
              isFeedbackModeForFriend && feedbackDetails?.isCorrect && "border-green-500 ring-2 ring-green-500 focus-visible:ring-green-500 bg-green-500/10 text-green-700 placeholder:text-green-700/70 font-medium",
              isFeedbackModeForFriend && feedbackDetails && !feedbackDetails.isCorrect && "border-destructive ring-2 ring-destructive focus-visible:ring-destructive bg-destructive/10 text-destructive placeholder:text-destructive/70 font-medium"
            )}
            aria-label="Antworteingabe"
            disabled={isFeedbackModeForFriend}
            aria-invalid={isFeedbackModeForFriend && feedbackDetails && !feedbackDetails.isCorrect}
            style={{ fontSize: '16px' }} // Explicitly set font size for iOS zoom prevention
          />
        )}
        {isFeedbackModeForFriend && feedbackDetails?.isCorrect && (
            <p className="text-md text-center font-semibold text-green-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2"/> Richtig! Genau das hat {creatorName} gesagt.
            </p>
        )}
        {isFeedbackModeForFriend && feedbackDetails && !feedbackDetails.isCorrect && (
           <p className="text-md text-center text-muted-foreground">
            <XCircle className="inline-block h-5 w-5 mr-1 text-destructive relative -top-0.5"/> Nicht ganz! {creatorName}s Antwort war: <strong className="font-bold text-primary">{feedbackDetails.creatorAnswer}</strong>
          </p>
        )}
      </CardContent>
      {!isMcqMode && (
        <CardFooter className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-0 pb-6 px-6">
          <Button 
            variant="outline" 
            onClick={onSkipQuestion} 
            size="lg" 
            className="w-full sm:w-auto text-md py-3"
            disabled={isFeedbackModeForFriend || (!isCreatorMode && isFriendMode && feedbackDetails !== null)} 
          >
            <SkipForward className="mr-2 h-5 w-5" />
            {isCreatorMode ? 'Frage überspringen' : (feedbackDetails ? 'Weiter' : 'Überspringen')}
          </Button>
          <Button 
            onClick={handleSubmitClick} 
            size="lg" 
            className="w-full sm:w-auto text-md py-3"
            disabled={!isCreatorMode && isFriendMode && feedbackDetails !== null && !feedbackDetails.isCorrect && currentInputValue !== feedbackDetails.creatorAnswer && currentInputValue !== feedbackDetails.friendAnswer} // Disable submit if friend is in feedback for wrong answer and hasn't changed to proceed
          >
            {isFeedbackModeForFriend ? (
              <>
                Nächste Frage <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Antwort abschicken <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
