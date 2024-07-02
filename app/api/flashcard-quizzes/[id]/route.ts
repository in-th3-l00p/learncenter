import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import FlashcardQuiz, { zNewFlashcardQuizSchema } from "@/models/FlashcardQuiz";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) return UnauthorizedResponse;

  try {
    const flashcardQuiz = await FlashcardQuiz.findById(params.id);

    if (!flashcardQuiz) return NotFoundResponse;

    if (flashcardQuiz.owner.toString() !== session.user.id) return UnauthorizedResponse;

    return NextResponse.json(flashcardQuiz);
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
    quiz = await FlashcardQuiz.findById(params.id);

    if (!quiz) return NotFoundResponse;
  } catch (e) {
    return NotFoundResponse;
  }

  if (!quiz.owner.equals(session.user.id)) return UnauthorizedResponse;

  const body = zNewFlashcardQuizSchema.safeParse(await req.json());

  if (body.error) return NextResponse.json(body.error, { status: 400 });

  try {
    await FlashcardQuiz.findByIdAndUpdate(params.id, body.data);

    return NextResponse.json(await FlashcardQuiz.findById(params.id));
  } catch (e) {
    return NotFoundResponse;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) return UnauthorizedResponse;

  let quiz;

  try {
    quiz = await FlashcardQuiz.findById(params.id);

    if (!quiz) return NotFoundResponse;

    if (quiz.owner.toString() !== session.user.id) return UnauthorizedResponse;
  } catch (e) {
    return NotFoundResponse;
  }

  if (!quiz.owner.equals(session.user.id)) return UnauthorizedResponse;

  try {
    await FlashcardQuiz.findByIdAndDelete(params.id);
  } catch (e) {
    return NotFoundResponse;
  }

  return NextResponse.json({}, { status: 200 });
}
