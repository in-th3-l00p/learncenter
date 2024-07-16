import { ZodSchema } from "zod";
import { NoteType } from "@/models/Note";
import stripe from "@/lib/stripe";
import { AIGenerator, AIGeneratorData } from "@/quizGenerator/types";
import defaultGenerator from "@/quizGenerator/generators/defaultGenerator";
import fixGenerator from "@/quizGenerator/generators/fixGenerator";

const GPT_TOKENS_METER_EVENT_NAME = "gpt-tokens";

async function executeGeneration(
  data: AIGeneratorData,
  generator: AIGenerator,
  customerId: string,
  schema: ZodSchema,
) {
  let generation = await generator(data);
  await stripe.billing.meterEvents.create({
    event_name: GPT_TOKENS_METER_EVENT_NAME,
    payload: {
      value: generation.tokens.toString(),
      stripe_customer_id: customerId
    }
  });
  return schema.safeParse(generation.data);
}

export default async function generate(
  note: NoteType,
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  zodSchema: ZodSchema,
  customerId: string,
  additionalQuery?: string
) {
  let data: AIGeneratorData = {
    noteTitle: note.title,
    noteContent: note.content,
    entityName,
    schema,
    additionalSchemaDescription,
    additionalQuery
  };
  let response = await executeGeneration(data, defaultGenerator, customerId, zodSchema);
  if (!response.success) {
    data.lastGeneration = response.data;
    data.errors = response.error;
    response = await executeGeneration(data, fixGenerator, customerId, zodSchema);
    if (!response.success)
      throw response.error;
  }

  return response.data;
}

