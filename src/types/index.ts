
export interface Question {
  id: string;
  text: (creatorName: string) => string;
  answerPlaceholder?: string; // Optional placeholder for the input field
}

export interface SubmittedAnswer {
  questionId: string;
  answer: string; // User's typed answer
}

// Data structure for a quiz being built by the creator
export interface QuizBuildInProgress {
  creatorName: string;
  answers: SubmittedAnswer[];
}

// Data structure for a completed quiz ready for sharing/results
export interface QuizData {
  id: string; // slug
  creatorName: string;
  creatorAnswers: SubmittedAnswer[]; // Creator's typed answers
  questionsUsed: Question[]; // The actual questions shown
  friendAttempts: FriendAttempt[];
}

export interface FriendAttempt {
  friendName: string;
  answers: SubmittedAnswer[]; // Friend's typed answers for the same questions
  score: number;
}

// Data for the share page (friend answering) - essentially the quiz structure
export interface FriendQuizContext {
  quizId: string;
  creatorName: string;
  questions: Question[];
}
