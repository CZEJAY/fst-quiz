"use client";

import { useEffect, useState } from "react";
import { QuizCard } from "./quiz-card";
import { QuizConfigModal } from "../mods/quiz-config-modal";
import { getQuizzes, QuizWithRelations } from "@/actions/quiz-actions";
import { QuizCardSkeleton } from "./quiz-card-skeleton";
import { DashboardHeader } from "./dashboard-header";

export function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizWithRelations[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const { quizzes, error } = await getQuizzes();
      setQuizzes(quizzes || []);
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  // @ts-ignore
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="w-full">
        <DashboardHeader
          heading="Loading Quizzes"
          text="Please wait while we load up your quiz explorer."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          {[...Array(6)].map((_, index) => (
            <QuizCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full gap-5 flex flex-col">
      <DashboardHeader
        heading="Explore Quizzes"
        text="View and choose any quiz to test your knowledge"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} onSelect={handleQuizSelect} />
        ))}
        {selectedQuiz && (
          <QuizConfigModal
            quiz={selectedQuiz}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
