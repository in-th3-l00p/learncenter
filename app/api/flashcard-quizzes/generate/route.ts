import createGenerator from "@/app/api/utils/generator";
import { zNewFlashcardQuizSchema } from "@/models/FlashcardQuiz";

const generator = createGenerator(
  "flashcards quiz",
  {
    title: "Flashcard quiz title",
    description: "Flashcard quiz description",
    flashcards: [{
      question: "Question 1",
      answer: "Answer 1"
    }],
    visibility: "public"
  },
  "the title key should contain the title of the quiz," +
  " the description key should contain the description of the quiz, " +
  "and the flashcards key should contain an array of flashcards, " +
  "where each flashcard has a question key and an answer key. " +
  "the \"visibility\" key should always be public.",
  zNewFlashcardQuizSchema,
);

export { generator as POST };