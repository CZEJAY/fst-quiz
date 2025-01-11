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

interface CompletedQuiz {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export default function CompletedQuizzesPage() {
  const [quizzes, setQuizzes] = useState<CompletedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompletedQuizzes = async () => {
      // In a real application, this would be an API call
      const mockData: CompletedQuiz[] = [
        {
          id: "1",
          title: "Math Quiz",
          score: 8,
          totalQuestions: 10,
          completedAt: "2023-05-01T12:00:00Z",
        },
        {
          id: "2",
          title: "Science Quiz",
          score: 7,
          totalQuestions: 10,
          completedAt: "2023-05-02T14:30:00Z",
        },
        {
          id: "3",
          title: "History Quiz",
          score: 9,
          totalQuestions: 10,
          completedAt: "2023-05-03T10:15:00Z",
        },
      ];
      setQuizzes(mockData);
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
      <DashboardHeader
        heading="Completed Quizzes"
        text="View your quiz history and performance."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{`${quiz.score}/${quiz.totalQuestions}`}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(quiz.completedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push(`/quiz-result/${quiz.id}`)}>
                View Results
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
