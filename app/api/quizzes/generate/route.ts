import createGenerator from "@/app/api/utils/generator";
import { zNewQuizSchema } from "@/models/Quiz";

const generator = createGenerator(
  "quiz",
  {
    title: "Quiz title",
    description: "Quiz description",
    questions: [{
      question: "Question 1",
      description: "Question 1 description",
      options: [{ option: "Option 1", isCorrect: true }]
    }],
    visibility: "public"
  },
  "the title key should contain the title of the quiz," +
  " the description key should contain the description of the quiz, " +
  "and the questions key should contain an array of questions, " +
  "where each question has a question key, a description key and an options key, " +
  "and the options key should contain an array of options, " +
  "where each option has an option key and an isCorrect key. " +
  "the \"visibility\" key should always be public.",
  zNewQuizSchema
);

export { generator as POST }
