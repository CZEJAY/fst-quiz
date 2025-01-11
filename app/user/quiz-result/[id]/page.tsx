"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/user/dashboard-shell";
import { DashboardHeader } from "@/components/user/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuestionResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
}

interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  totalPossibleScore: number;
  answers: QuestionResult[];
  completed: string;
  quiz: {
    title: string;
    questions: {
      id: string;
      text: string;
      type: string;
      options?: string[];
    }[];
  };
}

export default function ResultPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/quiz-results/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz result");
        }
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error fetching quiz result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!result) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Quiz Result Not Found"
          text="The requested quiz result could not be found."
        />
      </DashboardShell>
    );
  }

  const percentage = (result.score / result.totalPossibleScore) * 100;

  const shareUrl = `${window.location.origin}/quiz-result/${result.id}`;

  const handleShare = (platform: string) => {
    let url = "";
    const text = `I scored ${result.score}/${result.totalPossibleScore} on the "${result.quiz.title}" quiz!`;

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          shareUrl
        )}&title=${encodeURIComponent(text)}`;
        break;
    }

    window.open(url, "_blank");
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Quiz Result"
        text={`You scored ${result.score} out of ${result.totalPossibleScore} points.`}
      />
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{result.quiz.title}</CardTitle>
          <CardDescription>
            Completed on {new Date(result.completed).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={percentage} className="w-full" />
            <p className="text-center text-2xl font-bold">
              {percentage.toFixed(2)}%
            </p>
            <div className="flex justify-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleShare("twitter")}
                      variant="outline"
                      size="icon"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleShare("facebook")}
                      variant="outline"
                      size="icon"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleShare("linkedin")}
                      variant="outline"
                      size="icon"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-4">
              Question Breakdown
            </h3>
            {/* @ts-ignore */}
            {JSON.parse(result.answers).map((answer, index) => {
              const question = result.quiz.questions.find(
                (q) => q.id === answer.questionId
              );
              return (
                <div
                  key={answer.questionId}
                  className="border-b pb-4 mb-4 last:border-b-0"
                >
                  <p className="font-medium">
                    Question {index + 1}: {question?.text}
                  </p>
                  <p>Your answer: {answer.userAnswer}</p>
                  <p>Correct answer: {answer.correctAnswer}</p>
                  <p
                    className={
                      answer.isCorrect ? "text-green-600" : "text-red-600"
                    }
                  >
                    {answer.isCorrect ? "Correct" : "Incorrect"} (+
                    {answer.points} points)
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
