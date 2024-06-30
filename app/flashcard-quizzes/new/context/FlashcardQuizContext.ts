import React from "react";
import { ZodError } from "zod";
import { NewFlashcardQuizType } from "@/models/FlashcardQuiz";

export interface IFlashcardQuizContext {
  flashcardQuiz: NewFlashcardQuizType;
  setFlashcardQuiz: ((quiz: NewFlashcardQuizType) => void);

  error: ZodError | null;
  setError: (error: ZodError | null) => void;
}

const FlashcardQuizContext = React.createContext<IFlashcardQuizContext>({} as IFlashcardQuizContext);

export default FlashcardQuizContext;
