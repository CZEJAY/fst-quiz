"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/user/dashboard-shell";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultipleChoiceQuestion } from "@/components/user/multiple-choice-question";
import { ShortAnswerQuestion } from "@/components/user/short-answer-question";
import { TrueFalseQuestion } from "@/components/user/true-false-question";
import { QuestionNavigation } from "@/components/user/question-navigation";
import { QuizSkeleton } from "@/components/user/quiz-skeleton";
import { toast } from "@/hooks/use-toast";
import { getQuizById, QuizWithRelationsAndUser } from "@/actions/quiz-actions";
import { submitQuizResult } from "@/actions/quiz-result-actions";
import { Volume2, VolumeX } from "lucide-react";
import { Question } from "@prisma/client";
import QuizTracker from "@/components/user/session/timer";
import { SubmitQuizModal } from "@/components/mods/submit-quiz-modal";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<QuizWithRelationsAndUser | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerProgress, setTimerProgress] = useState(100);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const numberOfQuestions = useSearchParams().get("questions") as string;

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const { error, quiz } = await getQuizById(params.id, {
        takeValue: numberOfQuestions,
      });
      if (error) {
        setError(error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        // @ts-ignore
        setQuiz(quiz);
        // @ts-ignore
        const shuffled = shuffleArray(quiz.questions);
        setShuffledQuestions(shuffled);
        setTimeLeft(shuffled[0].timeLimit);
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [params.id, numberOfQuestions]);

  // Load attempt number on component mount
  useEffect(() => {
    const loadAttemptNumber = async () => {
      try {
        const response = await fetch(`/api/quiz/${params.id}/attempts`);
        const data = await response.json();
        setAttemptNumber(data.attemptCount + 1);
      } catch (error) {
        console.error("Error loading attempt number:", error);
      }
    };
    loadAttemptNumber();
  }, [params.id]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleSpeakerClick = useCallback(() => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      toast({
        title: "Error",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  }, [currentQuestion, isSpeaking]);

  const handleAnswer = (answer: any) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(shuffledQuestions[currentQuestionIndex + 1]?.timeLimit);
      setTimerProgress(100);
    } else {
      setIsSubmitModalOpen(true);
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  const handleTimeExpired = useCallback(() => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      handleNextQuestion();
    } else {
      setIsSubmitModalOpen(true);
    }
  }, [currentQuestionIndex, shuffledQuestions, handleNextQuestion]);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeLeft(shuffledQuestions[currentQuestionIndex - 1]?.timeLimit);
      setTimerProgress(100);
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
    setTimeLeft(shuffledQuestions[index].timeLimit);
    setTimerProgress(100);
  };

  const finishQuiz = async () => {
    setIsSubmitting(true);
    let totalScore = 0;
    const questionResults = shuffledQuestions.map((question) => {
      let isCorrect = false;
      let points = 0;
      const userAnswer = answers[question.id];
      switch (question.type) {
        case "multiple-choice":
          isCorrect = userAnswer === question.correctAnswer;
          break;
        case "short-answer":
          isCorrect =
            userAnswer?.toLowerCase().trim() ===
            question.correctAnswer.toLowerCase().trim();
          break;
        case "true-false":
          isCorrect = userAnswer?.toString() === question.correctAnswer;
          break;
      }
      if (isCorrect) {
        points = question.points;
        totalScore += points;
      }
      return {
        questionId: question.id,
        userAnswer:
          question.type === "multiple-choice"
            ? `${userAnswer} - ${question.options[Number(userAnswer)]}`
            : userAnswer,
        correctAnswer:
          question.type === "multiple-choice"
            ? `${question.correctAnswer} - ${
                question.options[Number(question.correctAnswer)]
              }`
            : question.correctAnswer,
        isCorrect,
        points,
      };
    });

    const result = await submitQuizResult({
      quizId: quiz!.id,
      score: totalScore,
      answers: questionResults,
      totalQuestions: shuffledQuestions.length,
      attemptNumber,
      totalPossibleScore: shuffledQuestions.reduce(
        (acc, q) => acc + q.points,
        0
      ),
    });

    setIsSubmitting(false);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      router.push(
        `/user/quiz-result/${result.resultId}?attempt=${attemptNumber}`
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <DashboardHeader
          heading="Loading Quiz..."
          text="Please wait while we fetch the quiz details."
        />
        <QuizSkeleton />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="w-full">
        <DashboardHeader
          heading="Error"
          text="There was an error loading the quiz."
        />
        <Card>
          <CardContent>
            <p>{error || "Unable to load quiz. Please try again later."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />
        );
      case "true-false":
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />
        );
      case "short-answer":
        return (
          <ShortAnswerQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />
        );
      default:
        return <p>Unsupported question type</p>;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col w-full gap-5">
        <DashboardHeader
          heading={quiz.title}
          text={`Question ${currentQuestionIndex + 1} of ${
            shuffledQuestions.length
          }`}
        />
        <div className="w-full max-w-3xl mx-auto mb-4">
          <QuizTracker
            totalQuestions={shuffledQuestions.length}
            currentQuestion={currentQuestionIndex + 1}
            timeLimit={currentQuestion.timeLimit as number}
            onTimeExpired={handleTimeExpired}
          />
        </div>
        <Suspense fallback={<QuizSkeleton />}>
          <Card className="w-full max-w-3xl min-h-[260px] max-h-[270px] mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{currentQuestion.text}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSpeakerClick}
                  aria-label={
                    isSpeaking ? "Stop speaking" : "Read question aloud"
                  }
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>{renderQuestion()}</CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestion.id] === undefined}
              >
                {currentQuestionIndex < shuffledQuestions.length - 1
                  ? "Next"
                  : "Finish Quiz"}
              </Button>
            </CardFooter>
          </Card>
        </Suspense>
        <QuestionNavigation
          questions={shuffledQuestions}
          currentQuestionIndex={currentQuestionIndex}
          answeredQuestions={answers}
          onNavigate={handleNavigate}
        />
      </div>
      <SubmitQuizModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={finishQuiz}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
