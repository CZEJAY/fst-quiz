"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Quiz, User, UserQuizResult } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type UserResultAndRelation = UserQuizResult & {
  quiz: Quiz;
};

export async function getUserQuizResults() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "User not found" };
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }
    const results = await prisma.userQuizResult.findMany({
      where: { userId: user?.id },
      include: { quiz: true },
    });
    return { results };
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch user quiz results" };
  }
}

export type AllResultsAndUsersAndQuiz = UserQuizResult & {
  quiz: Quiz;
  user: User;
};

export async function getAllQuizResults() {
  try {
    const results = await prisma.userQuizResult.findMany({
      include: { quiz: true, user: true },
    });
    return { results };
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch user quiz results" };
  }
}

export async function getQuizResults(quizId: string) {
  try {
    const results = await prisma.userQuizResult.findMany({
      where: { quizId },
      include: { user: true },
    });
    return { results };
  } catch (error) {
    return { error: "Failed to fetch quiz results" };
  }
}

interface QuestionResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
}

interface SubmitQuizResultParams {
  quizId: string;
  score: number;
  answers: QuestionResult[];
  totalQuestions: number;
  totalPossibleScore: number;
}

export async function createUserQuizResult({
  quizId,
  score,
  answers,
  totalQuestions,
  totalPossibleScore,
}: SubmitQuizResultParams) {
  try {
    const result = await prisma.userQuizResult.create({
      data: {
        quizId,
        userId: "user-id", // Replace with actual user ID from authentication
        score,
        totalQuestions,
        totalPossibleScore,
        answers: JSON.stringify(answers),
        completed: new Date(),
      },
    });
    revalidatePath(`/users/${result.userId}/results`);
    revalidatePath(`/quizzes/${result.quizId}/results`);
    return { result };
  } catch (error) {
    return { error: "Failed to create user quiz result" };
  }
}

export async function updateUserQuizResult(
  id: string,
  data: {
    score?: number;
    completed?: Date;
  }
) {
  try {
    const result = await prisma.userQuizResult.update({
      where: { id },
      data,
    });
    revalidatePath(`/users/${result.userId}/results`);
    revalidatePath(`/quizzes/${result.quizId}/results`);
    return { result };
  } catch (error) {
    return { error: "Failed to update user quiz result" };
  }
}

export async function deleteUserQuizResult(id: string) {
  try {
    const result = await prisma.userQuizResult.delete({ where: { id } });
    revalidatePath(`/users/${result.userId}/results`);
    revalidatePath(`/quizzes/${result.quizId}/results`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete user quiz result" };
  }
}
