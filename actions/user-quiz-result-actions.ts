"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserQuizResults(userId: string) {
  try {
    const results = await prisma.userQuizResult.findMany({
      where: { userId },
      include: { quiz: true },
    });
    return { results };
  } catch (error) {
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
