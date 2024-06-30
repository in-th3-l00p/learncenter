import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import { NextResponse } from "next/server";
import Note, { zNewNoteSchema } from "@/models/Note";

export async function PUT(req: Request, { params }: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session) return UnauthorizedResponse;

  let note;

  try {
    note = await Note.findById(params.id);

    if (!note) return NotFoundResponse;

  } catch (e) {
    return NotFoundResponse;
  }

  if (!note.users[0].userId.equals(session.user.id)) return UnauthorizedResponse;

  const body = zNewNoteSchema.safeParse(await req.json());

  if (body.error) return NextResponse.json(body.error, { status: 400 });

  try {
    await Note.findByIdAndUpdate(params.id, body.data);

    return NextResponse.json(await Note.findById(params.id));
  } catch (e) {
    return NotFoundResponse;
  }
}