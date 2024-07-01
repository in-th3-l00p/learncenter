import { Input, Textarea } from "@nextui-org/input";
import React, { useContext } from "react";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/components/NewForm/primitives";
import FlashcardQuizZodErrorParagraph from "@/app/flashcard-quizzes/components/FlashcardQuizZodErrorParagraph";

export function FlashcardQuizInformationInput<T>({ context }: {
  context: React.Context<T>
}) {
  const { flashcardQuiz, setFlashcardQuiz } = useContext(context) as {
    flashcardQuiz: {
      title: string,
      description: string,
    },
    setFlashcardQuiz: React.Dispatch<React.SetStateAction<{
      title: string,
      description: string,
    }>>,
  };

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Tell us about the flashcard quiz:</h2>

      <FlashcardQuizZodErrorParagraph
        context={context}
        path={["title"]}
      />
      <Input
        className={"mb-4"}
        label={"Title"}
        placeholder={"Flashcard quiz title"}
        type={"text"}
        value={flashcardQuiz.title}
        onChange={(e) => setFlashcardQuiz({ ...flashcardQuiz, title: e.target.value })}
      />

      <FlashcardQuizZodErrorParagraph
        context={context}
        path={["description"]}
      />
      <Textarea
        label={"Description"}
        placeholder={"Describe your flashcard quiz"}
        value={flashcardQuiz.description}
        onChange={(e) => setFlashcardQuiz({ ...flashcardQuiz, description: e.target.value })}
      />
    </div>
  );
}
