"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/user/dashboard-shell";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { CompletedQuizzesSkeleton } from "@/components/user/completed-quizzes-skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  getUserQuizResults,
  UserResultAndRelation,
} from "@/actions/user-quiz-result-actions";
import { useSession } from "next-auth/react";
import { UserQuizResult } from "@prisma/client";
import { toast } from "sonner";
import QuizPerformanceTracker from "@/components/user/QuizPerformanceTracker";

interface CompletedQuiz {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export default function CompletedQuizzesPage() {
  const [quizzes, setQuizzes] = useState<UserResultAndRelation[]>([]);
  const { data, status } = useSession();
  const [loading, setLoading] = useState(status === "loading");
  const router = useRouter();

  useEffect(() => {
    const fetchCompletedQuizzes = async () => {
      const { error, results } = await getUserQuizResults();
      if (error) {
        toast.error("Something went wrong", {
          description: error,
        });
      }
      setQuizzes(results || []);
      setLoading(false);
    };

    fetchCompletedQuizzes();
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Completed Quizzes"
          text="View your quiz history and performance."
        />
        <CompletedQuizzesSkeleton />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <QuizPerformanceTracker results={quizzes} />
      <DashboardHeader
        heading="Completed Quizzes"
        text="View your quiz history and performance."
      />
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{quiz.quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{`${quiz.score}/${quiz.totalQuestions}`}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(quiz.completed).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(`/user/quiz-result/${quiz.id}`)}
              >
                View Results
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
