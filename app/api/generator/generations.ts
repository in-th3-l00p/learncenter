import { ZodError, ZodSchema } from "zod";
import { NoteType } from "@/models/Note";
import openai from "@/lib/openai";
import stripe from "@/lib/stripe";

const GPT_TOKENS_METER_EVENT_NAME = "gpt-tokens";

export async function generate(
  note: NoteType,
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  zodSchema: ZodSchema,
  customerId: string,
  additionalQuery?: string
) {
  let generation = await initialGeneration(
    note.title,
    note.content,
    entityName,
    schema,
    additionalSchemaDescription,
    additionalQuery
  );
  await stripe.billing.meterEvents.create({
    event_name: GPT_TOKENS_METER_EVENT_NAME,
    payload: {
      value: generation.tokens.toString(),
      stripe_customer_id: customerId
    }
  });
  let response = zodSchema.safeParse(generation.data);
  if (!response.success) {
    generation = await fixGeneration(
      response,
      response.error,
      note.title,
      note.content,
      entityName,
      schema,
      additionalSchemaDescription,
      additionalQuery
    )
    await stripe.billing.meterEvents.create({
      event_name: GPT_TOKENS_METER_EVENT_NAME,
      payload: {
        value: generation.tokens.toString(),
        stripe_customer_id: customerId
      }
    });
    response = zodSchema.safeParse(generation.data);
    if (!response.success)
      throw response.error
  }

  return response.data;
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
          `Create as many ${entityName} as you can, ` +
          `try creating one for each paragraph, or piece of information. ` +
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
    model: "gpt-4o",
    response_format: { type: "json_object" }
  });

  return {
    data: JSON.parse(generation.choices[0].message.content!),
    tokens: generation.usage?.total_tokens || 0
  };
}

async function fixGeneration(
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

  return {
    data: JSON.parse(generationFix.choices[0].message.content!),
    tokens: generationFix.usage?.total_tokens || 0
  };
}
