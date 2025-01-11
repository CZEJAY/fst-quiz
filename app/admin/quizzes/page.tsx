import { getQuizzes } from "@/actions/quiz-actions";
import CRUDQBTN from "@/components/admin/quiz/CRUDQBTN";
import { Quiz, QuizTable } from "@/components/admin/quiz/quiz-table";
import React from "react";

const page = async () => {
  const { error, quizzes } = await getQuizzes();
  if (error) return <div>{error}</div>;
  if (!quizzes) return <div>No quizzes found</div>;
  const formattedQuizzes: Quiz[] = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category.name,
    categoryId: quiz.category.id,
    difficulty: quiz.difficulty,
    questions: quiz.questions.length,
    createdAt: quiz.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    questionCount: quiz.questions.length,
    status: quiz.status,
  }));
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
        <div className="flex items-center space-x-2">
          <CRUDQBTN />
        </div>
      </div>
      <QuizTable data={formattedQuizzes} />
    </div>
  );
};

export default page;
