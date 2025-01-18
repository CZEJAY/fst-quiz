"use server";

import { prisma } from "@/lib/prisma";
import { Category, Question, Quiz } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";

export type QuestionWithRelations = Question & {
  quiz: Quiz & {
    category: Category;
  };
};
export async function getQuestions(): Promise<
  { questions: QuestionWithRelations[] } | { error: string }
> {
  noStore();
  try {
    const questions = await prisma.question.findMany({
      include: {
        quiz: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return { questions };
  } catch (error) {
    return { error: "Failed to fetch questions" };
  }
}

export async function getQuestionById(id: string) {
  try {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) {
      return { error: "Question not found" };
    }
    return { question };
  } catch (error) {
    return { error: "Failed to fetch question" };
  }
}

export async function createQuestion(data: {
  quizId: string;
  text: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
  timeLimit?: number;
}) {
  try {
    const question = await prisma.question.create({ data });
    revalidatePath(`/admin/questions`);
    return { question };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create question" };
  }
}

export async function updateQuestion(
  id: string,
  data: {
    text?: string;
    type?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
    points?: number;
    timeLimit?: number;
  }
) {
  try {
    const question = await prisma.question.update({
      where: { id },
      data,
    });
    const quiz = await prisma.quiz.findFirst({
      where: { questions: { some: { id } } },
    });
    if (quiz) {
      revalidatePath(`/questions`);
    }
    return { question };
  } catch (error) {
    return { error: "Failed to update question" };
  }
}

export async function deleteQuestion(id: string) {
  try {
    const question = await prisma.question.delete({ where: { id } });
    const quiz = await prisma.quiz.findFirst({
      where: { questions: { some: { id } } },
    });

    revalidatePath(`/questions`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete question" };
  }
}
