import React from "react";
import { ZodError } from "zod";
import { FlashcardQuizType } from "@/models/FlashcardQuiz";

export interface IFlashcardQuizContext {
  flashcardQuiz: FlashcardQuizType;
  setFlashcardQuiz: ((quiz: FlashcardQuizType) => void);

  selectedFlashcardIndex: number;
  setSelectedFlashcardIndex: (index: number) => void;

  error: ZodError | null;
  setError: (error: ZodError | null) => void;
}

const FlashcardQuizContext = React.createContext<IFlashcardQuizContext>({} as IFlashcardQuizContext);

export default FlashcardQuizContext;
