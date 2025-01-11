"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function submitQuizResult({
  quizId,
  score,
  answers,
  totalQuestions,
  totalPossibleScore,
}: SubmitQuizResultParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
    });
    if (!user) {
      return { error: "User not found" };
    }
    const result = await prisma.userQuizResult.create({
      data: {
        quizId,
        userId: user.id,
        score,
        totalPossibleScore,
        totalQuestions,
        answers: JSON.stringify(answers),
        completed: new Date(),
      },
    });

    revalidatePath(`/quiz-result/${result.id}`);
    return { resultId: result.id };
  } catch (error) {
    console.error("Failed to submit quiz result:", error);
    return { error: "Failed to submit quiz result. Please try again." };
  }
}
