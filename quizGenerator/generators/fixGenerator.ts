import openai from "@/lib/openai";
import { AIGenerator } from "@/quizGenerator/utils/types";
import getMaxTokens from "@/quizGenerator/utils/getMaxTokens";

const fixGenerator: AIGenerator =
  async (subscription, {
           noteTitle,
           noteContent,
           entityName,
           schema,
           additionalSchemaDescription,
           additionalQuery,
           lastGeneration,
           errors
         }) => {
    const generation = await openai.chat.completions.create({
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
            JSON.stringify(lastGeneration) +
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
      response_format: { type: "json_object" },
      max_tokens: await getMaxTokens(subscription)
    });
    if (generation.choices[0].finish_reason === "length") {
      throw {
        issues: [{
          message: "You've exceeded your subscription limit."
        }]
      }
    }

    return {
      data: JSON.parse(generation.choices[0].message.content!),
      tokens: generation.usage?.total_tokens || 0
    };
  };

export default fixGenerator;