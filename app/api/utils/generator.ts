import { z, ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import { NextResponse } from "next/server";
import Note, { NoteType } from "@/models/Note";
import openai from "@/lib/openai";

const requestSchema = z.object({
  noteId: z.string().min(1),
  additionalQuery: z.string().optional()
});

async function firstGeneration(
  note: NoteType,
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  additionalQuery?: string
) {
  const generation = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          `You are a ${entityName} generator. ` +
          `Please generate a ${entityName} based on the following note. ` +
          "You can use an additional query, that will be submitted to you. " +
          "Output should be json, and have the following format: " +
          JSON.stringify(schema) + ". " +
          `so, ${additionalSchemaDescription}.`
      },
      {
        role: "user",
        content: `This is the note title "${note.title}", and this is it's content: "${note.content}".`
      },
      {
        role: "user",
        content: "Here's an additional query: " + additionalQuery
      }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" }
  });

  return JSON.parse(generation.choices[0].message.content!);
}

async function firstGenerationFix(
  generation: any,
  errors: ZodError,
  note: NoteType,
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  additionalQuery?: string
) {
  const generationFix = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          `You are a ${entityName} generator. ` +
          `You have already generated a ${entityName}, based on a given note. but you received some errors. ` +
          `Please fix the errors you made, that are given to you. ` +
          "You can use an additional query, that will be submitted to you. " +
          "Output should be json, and have the following format: " +
          JSON.stringify(schema) + ". " +
          `so, ${additionalSchemaDescription}.`
      },
      {
        role: "user",
        content:
          "Here are the errors you made: " +
          JSON.stringify(errors) +
          ". and here's what you generated: " +
          JSON.stringify(generation) +
          ". You will receive the note again, and the additional query."
      },
      {
        role: "user",
        content: `This is the note title "${note.title}", and this is it's content: "${note.content}".`
      },
      {
        role: "user",
        content: "Here's an additional query: " + additionalQuery
      }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" }
  });

  return JSON.parse(generationFix.choices[0].message.content!);
}

export default function createGenerator(
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  zSchema: z.Schema
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

    let generation = zSchema.safeParse(await firstGeneration(
      note,
      entityName,
      schema,
      additionalSchemaDescription,
      body.data.additionalQuery
    ));
    if (!generation.success) {
      generation = zSchema.safeParse(await firstGenerationFix(
        generation,
        generation.error,
        note,
        entityName,
        schema,
        additionalSchemaDescription,
        body.data.additionalQuery
      ));
      if (!generation.success) {
        return NextResponse.json(
          JSON.stringify(generation.error),
          { status: 400 }
        );
      }
    }

    return NextResponse.json(generation.data, { status: 200 });
  }
}