import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import FlashcardQuiz, { zNewFlashcardQuizSchema } from "@/models/FlashcardQuiz";

export async function POST(req: Request) {
  // authorize
  const session = await getServerSession(authOptions);

  if (!session) return new Response(null, { status: 401 });
  const user = await User.findById(session.user.id);

  if (!user) return new Response(null, { status: 401 });

  // validate request
  const body = await req.json();
  const flashcardQuiz = zNewFlashcardQuizSchema.safeParse({
    ...body,
    owner: user._id.toString(),
  });

  if (flashcardQuiz.error) return NextResponse.json(flashcardQuiz.error, { status: 400 });

  // create flashcard quiz
  return NextResponse.json(await FlashcardQuiz.create(flashcardQuiz.data));
}
