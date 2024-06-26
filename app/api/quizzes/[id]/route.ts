import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import Quiz from "@/models/Quiz";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) return UnauthorizedResponse;

  try {
    const quiz = await Quiz.findById(params.id);

    if (!quiz) return NotFoundResponse;

    if (quiz.owner.toString() !== session.user.id) return UnauthorizedResponse;

    return NextResponse.json(quiz);
  } catch (e) {
    return NotFoundResponse;
  }
}
