import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import Quiz, { zNewQuizSchema } from "@/models/Quiz";
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) return UnauthorizedResponse;

  let quiz;

  try {
    quiz = await Quiz.findById(params.id);

    if (!quiz) return NotFoundResponse;

    if (quiz.owner.toString() !== session.user.id) return UnauthorizedResponse;
  } catch (e) {
    return NotFoundResponse;
  }

  const body = zNewQuizSchema.safeParse(await req.json());

  if (body.error) return NextResponse.json(body.error, { status: 400 });

  try {
    await Quiz.findByIdAndUpdate(params.id, body.data);

    return NextResponse.json(await Quiz.findById(params.id));
  } catch (e) {
    return NotFoundResponse;
  }
}
