import {
  getQuestions,
  QuestionWithRelations,
} from "@/actions/question-actions";
import {
  Question,
  QuestionsTable,
} from "@/components/admin/questions/questions-table";
import { RouteErrorComponent } from "@/components/Errors/error-component";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import CreateQuestion from "./_components/create-question";

const page = async () => {
  // @ts-ignore
  const { error, questions } = await getQuestions();
  if (error) {
    return <RouteErrorComponent info={error} error={error} />;
  }
  const formattedQuestions: Question[] = questions.map(
    (question: QuestionWithRelations) => ({
      id: question.id,
      question: question.text,
      category: question.quiz.category.name,
      difficulty: question.quiz.difficulty,
      type: question.type,
      quiz: question.quiz.title,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  );
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Questions</h2>
        <div className="flex items-center space-x-2">
          <CreateQuestion />
        </div>
      </div>
      <QuestionsTable data={formattedQuestions} />
    </div>
  );
};

export default page;
