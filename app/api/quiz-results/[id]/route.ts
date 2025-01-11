import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.userQuizResult.findUnique({
      where: { id: params.id },
      include: {
        quiz: {
          include: {
            questions: {
              select: {
                id: true,
                text: true,
                type: true,
                options: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Quiz result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching quiz result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
