"use server";

import { prisma as db } from "@/lib/prisma";
import { auth } from "@/auth";
import { User } from "@prisma/client";

export async function getLeaderboard(limit = 10) {
  try {
    // Get users with their total scores and quiz counts
    const leaderboard = await db.user.findMany({
      take: limit,
      select: {
        id: true,
        name: true,
        image: true,
        quizResults: {
          select: {
            score: true,
            totalPossibleScore: true,
            completed: true,
          },
        },
      },
    });

    // Process and sort users by their average score
    const processedLeaderboard = leaderboard
      .map((user) => {
        const totalQuizzes = user.quizResults.length;
        const averageScore =
          user.quizResults.length > 0
            ? user.quizResults.reduce(
                (acc, result) =>
                  acc + (result.score / result.totalPossibleScore) * 100,
                0
              ) / totalQuizzes
            : 0;

        return {
          id: user.id,
          name: user.name || "Anonymous User",
          image: user.image,
          averageScore,
          totalQuizzes,
          lastActive:
            user.quizResults.length > 0
              ? Math.max(
                  ...user.quizResults.map((r) =>
                    new Date(r.completed).getTime()
                  )
                )
              : null,
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore);

    return { processedLeaderboard };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { error: "Failed to fetch leaderboard" };
  }
}

export type UserAndRelationWithProfile = User & {
  quizResults: {
    score: number;
    totalPossibleScore: number;
    completed: Date;
    quiz: {
      title: string;
      difficulty: string;
      category: {
        name: string;
      };
    };
  }[];
  createdQuizzes: {
    id: string;
    title: string;
    difficulty: string;
    status: string;
    category: {
      name: string;
    };
  }[];
};

export async function getUserProfile() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "User not found" };
    }

    const profile = await db.user.findUnique({
      where: { email: session.user.email as string },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        quizResults: {
          select: {
            score: true,
            totalPossibleScore: true,
            completed: true,
            quiz: {
              select: {
                title: true,
                difficulty: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        createdQuizzes: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            status: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return { error: "User not found" };
    }

    return { profile };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { error: "Failed to fetch user profile" };
  }
}

export async function updateUserSettings(data: {
  name?: string;
  email?: string;
  image?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}
