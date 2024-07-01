"use client";

import { spacing } from "@/components/NewForm/primitives";
import { subtitle } from "@/components/primitives";
import { DropdownSelector } from "@/components/NewForm/dropdownSelector";
import React, { useContext } from "react";
import { Input } from "@nextui-org/input";
import FlashcardQuizZodErrorParagraph from "@/app/flashcard-quizzes/components/FlashcardQuizZodErrorParagraph";
import { Button } from "@nextui-org/button";

export default function FlashcardQuizFlashcards<T>({ context }: {
  context: React.Context<T>
}) {
  const {
    flashcardQuiz,
    setFlashcardQuiz,
    selectedFlashcardIndex,
    setSelectedFlashcardIndex
  } = useContext(context) as {
    flashcardQuiz: {
      flashcards: {
        question: string,
        answer: string
      }[]
    },
    setFlashcardQuiz: React.Dispatch<React.SetStateAction<{
      flashcards: {
        question: string,
        answer: string
      }[]
    }>>,
    selectedFlashcardIndex: number,
    setSelectedFlashcardIndex: React.Dispatch<React.SetStateAction<number>>
  };

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
          context={context}
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
          context={context}
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

      <div>
        <Button
          color={"danger"}
          type={"button"}
          onClick={() => {
            const updatedFlashcards = [...flashcardQuiz.flashcards];

            updatedFlashcards.splice(selectedFlashcardIndex, 1);
            setFlashcardQuiz({ ...flashcardQuiz, flashcards: updatedFlashcards });
            setSelectedFlashcardIndex(0);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
