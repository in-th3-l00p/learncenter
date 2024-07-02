import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import { NextResponse } from "next/server";
import Note from "@/models/Note";
import openai from "@/lib/openai";

const requestSchema = z.object({
  noteId: z.string().min(1),
  additionalQuery: z.string().optional()
});

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

    const completion = await openai.chat.completions.create({
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
          content: "Here's an additional query: " + body.data.additionalQuery
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    let response = zSchema.safeParse(completion.choices[0].message.content);
    if (!response.success) {
      const completionFix = await openai.chat.completions.create({
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
              JSON.stringify(response.error) +
              ". and here's what you generated: " +
              JSON.stringify(completion.choices[0].message.content) +
              ". You will receive the note again, and the additional query."
          },
          {
            role: "user",
            content: `This is the note title "${note.title}", and this is it's content: "${note.content}".`
          },
          {
            role: "user",
            content: "Here's an additional query: " + body.data.additionalQuery
          }
        ],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" }
      });

      response = zSchema.safeParse(completionFix.choices[0].message.content);
      if (!response.success) {
        return NextResponse.json(
          JSON.stringify(response.error),
          { status: 400 }
        );
      }
    }

    return NextResponse.json(response, { status: 200 });
  }
}