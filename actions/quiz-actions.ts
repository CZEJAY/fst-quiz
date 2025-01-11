"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Category,
  Question,
  Quiz,
  QuizDifficulty,
  QuizStatus,
  User,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

export type QuizWithRelations = Quiz & {
  category: Category;
  questions: Question[];
  createdBy: User;
};

export async function getQuizzes() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { category: true, createdBy: true, questions: true },
    });
    return { quizzes };
  } catch (error) {
    return { error: "Failed to fetch quizzes" };
  }
}

export type QuizWithRelationsAndUser = Quiz & {
  category: Category;
  questions: Question[];
  createdBy: User;
};

export async function getQuizById(
  id: string,
  {
    takeValue = undefined,
    skipValue = undefined,
  }: { takeValue?: string; skipValue?: string } = {}
) {
  try {
    if (
      (takeValue && isNaN(parseInt(takeValue))) ||
      (skipValue && isNaN(parseInt(skipValue)))
    ) {
      return { error: "Invalid takeValue or skipValue" };
    }
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: true,
        questions: {
          take: takeValue ? parseInt(takeValue) : undefined,
          skip: skipValue ? parseInt(skipValue) : undefined,
        },
      },
    });
    if (!quiz) {
      return { error: "Quiz not found" };
    }
    return { quiz };
  } catch (error) {
    return { error: "Failed to fetch quiz" };
  }
}

export async function createQuiz(data: {
  title: string;
  description?: string;
  categoryId: string;
  createdById?: string;
  difficulty: QuizDifficulty;
  status: QuizStatus;
}) {
  try {
    const session = await auth();
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
    });
    if (!user) {
      return {
        error: "User not found",
      };
    }
    const quiz = await prisma.quiz.create({
      data: {
        ...data,
        difficulty: data.difficulty,
        createdById: user.id,
      },
    });
    revalidatePath("/quizzes");
    return { quiz };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create quiz" };
  }
}

export async function updateQuiz(
  id: string,
  data: {
    title?: string;
    description?: string;
    categoryId?: string;
  }
) {
  try {
    const quiz = await prisma.quiz.update({
      where: { id },
      data,
    });
    revalidatePath("/quizzes");
    revalidatePath(`/quizzes/${id}`);
    return { quiz };
  } catch (error) {
    return { error: "Failed to update quiz" };
  }
}

export async function deleteQuiz(id: string) {
  try {
    await prisma.quiz.delete({ where: { id, status: "draft" } });
    revalidatePath("/quizzes");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete quiz, only drafted quizzes can be deleted",
    };
  }
}
