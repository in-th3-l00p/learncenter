"use client";

import { spacing } from "@/app/quizzes/components/primitives";
import { subtitle } from "@/components/primitives";
import { DropdownSelector } from "@/app/quizzes/components/dropdownSelector";
import { useContext, useState } from "react";
import FlashcardQuizContext from "@/app/flashcard-quizzes/new/context/FlashcardQuizContext";
import { Input } from "@nextui-org/input";
import FlashcardQuizZodErrorParagraph from "@/app/flashcard-quizzes/new/components/QuizZodErrorParagraph";

export default function FlashcardQuizFlashcards() {
  const { flashcardQuiz, setFlashcardQuiz } = useContext(FlashcardQuizContext);
  const [selectedFlashcardIndex, setSelectedFlashcardIndex] = useState<number>(0);

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Add flashcards:</h2>

      <DropdownSelector
        className={"mb-4"}
        items={flashcardQuiz.flashcards.map(
          (_, index) => `Flashcard ${index + 1}`
        )}
        selected={selectedFlashcardIndex}
        setSelected={setSelectedFlashcardIndex}
        newOption={true}
        onNewOption={() => {
          setFlashcardQuiz({
            ...flashcardQuiz,
            flashcards: [
              ...flashcardQuiz.flashcards,
              {
                question: "",
                answer: "",
              },
            ],
          });
          setSelectedFlashcardIndex(flashcardQuiz.flashcards.length);
        }}
      />

      <div>
        <FlashcardQuizZodErrorParagraph
          path={[`flashcards`, selectedFlashcardIndex, "question"]}
        />
        <Input
          className={"mb-4"}
          label={"Question"}
          placeholder={"Question"}
          type={"text"}
          value={flashcardQuiz.flashcards[selectedFlashcardIndex].question}
          onChange={(e) => {
            const updatedFlashcards = [...flashcardQuiz.flashcards];

            updatedFlashcards[selectedFlashcardIndex].question = e.target.value;
            setFlashcardQuiz({ ...flashcardQuiz, flashcards: updatedFlashcards });
          }}
        />

        <FlashcardQuizZodErrorParagraph
          path={[`flashcards`, selectedFlashcardIndex, "answer"]}
        />
        <Input
          className={"mb-4"}
          label={"Answer"}
          placeholder={"Answer"}
          type={"text"}
          value={flashcardQuiz.flashcards[selectedFlashcardIndex].answer}
          onChange={(e) => {
            const updatedFlashcards = [...flashcardQuiz.flashcards];

            updatedFlashcards[selectedFlashcardIndex].answer = e.target.value;
            setFlashcardQuiz({ ...flashcardQuiz, flashcards: updatedFlashcards });
          }}
        />
      </div>
    </div>
  );
}
