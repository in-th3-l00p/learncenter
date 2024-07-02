import { ZodError, ZodSchema } from "zod";
import { NoteType } from "@/models/Note";
import openai from "@/lib/openai";

function countTokens(text: string) {
  return text.length / 4;
}

const MAX_TOKENS = 16385;
const MAX_ADDITIONAL_QUERY_TOKENS = 1000;
const SAFETY_MARGIN = 5000;

export async function generation(
  note: NoteType,
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  zodSchema: ZodSchema,
  additionalQuery?: string
) {
  const additionalQueryTokens = additionalQuery ? countTokens(additionalQuery) : 0;
  if (additionalQuery && additionalQueryTokens > MAX_ADDITIONAL_QUERY_TOKENS)
    throw {
      issues: [{
        path: ["additionalQuery"],
        message: "Additional query is too long."
      }]
    };

  const tokens =
    countTokens(note.title) +
    countTokens(note.content) +
    MAX_ADDITIONAL_QUERY_TOKENS +
    countTokens(entityName) +
    countTokens(additionalSchemaDescription) +
    SAFETY_MARGIN;
  if (tokens > MAX_TOKENS)
    throw {
      issues: [{
        path: ["note"],
        message: "Note is too long."
      }]
    };

  let generation = zodSchema.safeParse(await initialGeneration(
    note.title,
    note.content,
    entityName,
    schema,
    additionalSchemaDescription,
    additionalQuery
  ));
  if (!generation.success) {
    generation = zodSchema.safeParse(await initialGenerationFix(
      generation,
      generation.error,
      note.title,
      note.content,
      entityName,
      schema,
      additionalSchemaDescription,
      additionalQuery
    ));
    if (!generation.success) {
      throw generation.error
    }
  }

  return generation.data;
}

async function initialGeneration(
  noteTitle: string,
  noteContent: string,
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
        content: `This is the note title "${noteTitle}", and this is it's content: "${noteContent}".`
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

async function initialGenerationFix(
  generation: any,
  errors: ZodError,
  noteTitle: string,
  noteContent: string,
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
        content: `This is the note title "${noteTitle}", and this is it's content: "${noteContent}".`
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
