import { Input, Textarea } from "@nextui-org/input";
import { useContext } from "react";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/app/quizzes/components/primitives";
import FlashcardQuizContext from "@/app/flashcard-quizzes/new/context/FlashcardQuizContext";
import FlashcardQuizZodErrorParagraph from "@/app/flashcard-quizzes/new/components/QuizZodErrorParagraph";

export function FlashcardQuizInformationInput() {
  const { flashcardQuiz, setFlashcardQuiz } = useContext(FlashcardQuizContext);

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Tell us about the flashcard quiz:</h2>

      <FlashcardQuizZodErrorParagraph path={["title"]} />
      <Input
        className={"mb-4"}
        label={"Title"}
        placeholder={"Flashcard quiz title"}
        type={"text"}
        value={flashcardQuiz.title}
        onChange={(e) => setFlashcardQuiz({ ...flashcardQuiz, title: e.target.value })}
      />

      <FlashcardQuizZodErrorParagraph path={["description"]} />
      <Textarea
        label={"Description"}
        placeholder={"Describe your flashcard quiz"}
        value={flashcardQuiz.description}
        onChange={(e) => setFlashcardQuiz({ ...flashcardQuiz, description: e.target.value })}
      />
    </div>
  );
}
