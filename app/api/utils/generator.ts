import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import { NextResponse } from "next/server";
import Note from "@/models/Note";
import { generation } from "@/app/api/utils/generations";

const requestSchema = z.object({
  noteId: z.string().min(1),
  additionalQuery: z.string().optional()
});

export default function createGenerator(
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  zodSchema: z.Schema
): (req: Request) => Promise<NextResponse> {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);
    if (!session) return UnauthorizedResponse;

    const body = requestSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json(
        JSON.stringify(body.error),
        { status: 400 }
      );
    }

    const note = await Note.findById(body.data.noteId);
    if (!note) return NotFoundResponse;
    if (note.users[0].userId.toString() !== session.user.id)
      return UnauthorizedResponse;

    return NextResponse.json(
      await generation(
        note,
        entityName,
        schema,
        additionalSchemaDescription,
        zodSchema,
        body.data.additionalQuery
      ),
      { status: 200 }
    );
  }
}