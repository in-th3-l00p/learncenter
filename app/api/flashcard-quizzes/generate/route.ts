import { z } from "zod";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import Note from "@/models/Note";
import openai from "@/lib/openai";

const requestSchema = z.object({
  noteId: z.string().min(1),
  additionalQuery: z.string().optional()
});

export async function POST(req: Request) {
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
          "You are a flashcards quiz generator. " +
          "Please generate a flashcards quiz based on the following note. " +
          "You can use an additional query, that will be submitted to you. " +
          "Output should be json, and have the following format: " +
          "{ \"title\": \"Flashcard quiz title\", \"description\": \"Flashcard quiz description\", \"flashcards\": [ { \"question\": \"Question 1\", \"answer\": \"Answer 1\" }, ] } " +
          "so, the title key should contain the title of the quiz, the description key should contain the description of the quiz, and the flashcards key should contain an array of flashcards, where each flashcard has a question key and an answer key."
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

  return NextResponse.json(
    JSON.parse(completion.choices[0].message.content!),
    { status: 200 }
  );
}