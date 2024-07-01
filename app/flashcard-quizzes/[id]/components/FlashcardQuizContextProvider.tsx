"use client";

import React, { useState } from "react";
import { ZodError } from "zod";

import { FlashcardQuizType } from "@/models/FlashcardQuiz";
import FlashcardQuizContext from "@/app/flashcard-quizzes/[id]/components/FlashcardQuizContext";

export default function FlashcardQuizContextProvider({ flashcardQuiz, children }: {
  flashcardQuiz: string;
  children: React.ReactNode;
}) {
  const [
    statefulFlashcardQuiz,
    setStatefulFlashcardQuiz
  ] = useState<FlashcardQuizType>(JSON.parse(flashcardQuiz));
  const [selectedFlashcardIndex, setSelectedFlashcardIndex] = useState<number>(0);
  const [error, setError] = useState<ZodError | null>(null);

  return (
    <FlashcardQuizContext.Provider
      value={{
        flashcardQuiz: statefulFlashcardQuiz,
        setFlashcardQuiz: setStatefulFlashcardQuiz,
        selectedFlashcardIndex,
        setSelectedFlashcardIndex,
        error, setError,
      }}
    >
      {children}
    </FlashcardQuizContext.Provider>
  );
}
