import openai from "@/lib/openai";
import { AIGenerator } from "@/aiGenerator/generations/types";

const defaultGenerator: AIGenerator =
  async ({
           noteTitle,
           noteContent,
           entityName,
           schema,
           additionalSchemaDescription,
           additionalQuery
         }) => {
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
  };

export default defaultGenerator;