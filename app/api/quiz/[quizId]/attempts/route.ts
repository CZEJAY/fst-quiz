import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// API route to get attempt count
export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attemptCount = await prisma.userQuizResult.count({
      where: {
        userId: session.user.id,
        quizId: params.quizId,
      },
    });

    return NextResponse.json({ attemptCount });
  } catch (error) {
    console.error("Error getting attempt count:", error);
    return NextResponse.json(
      { error: "Failed to get attempt count" },
      { status: 500 }
    );
  }
}
