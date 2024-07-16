import { createGenerator } from "@/quizGenerator";
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
    visibility: "public",
    owner: ""
  },
  "the title key should contain the title of the quiz," +
  " the description key should contain the description of the quiz, " +
  "and the flashcards key should contain an array of flashcards, " +
  "where each flashcard has a question key and an answer key. " +
  "the \"visibility\" key should always be public, and the \"owner\" should be an empty string.",
  zNewFlashcardQuizSchema,
);

export { generator as POST };