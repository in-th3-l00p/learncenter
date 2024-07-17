import { Stripe } from "stripe";

export type AIGeneratorData = {
  noteTitle: string;
  noteContent: string;
  entityName: string;
  schema: any;
  additionalSchemaDescription: string;
  additionalQuery?: string;
  lastGeneration?: any
  errors?: any;
};

export type AIGenerator = (subscription: Stripe.Subscription, data: AIGeneratorData) => Promise<{
  data: any;
  tokens: number;
}>;