import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import User from "@/models/User";
import Quiz, { zQuizSchema } from "@/models/Quiz";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  // authorize
  const session = await getServerSession(authOptions);

  if (!session) return new Response(null, { status: 401 });
  const user = await User.findById(session.user.id);

  if (!user) return new Response(null, { status: 401 });

  // validate request
  const body = await req.json();
  const quiz = zQuizSchema.safeParse({ ...body, owner: user._id.toString() });

  if (quiz.error) return NextResponse.json(quiz.error, { status: 400 });

  // create quiz
  return NextResponse.json(await Quiz.create(quiz.data));
}
