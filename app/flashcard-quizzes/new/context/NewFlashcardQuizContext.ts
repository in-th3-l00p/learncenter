import React from "react";
import { ZodError } from "zod";
import { NewFlashcardQuizType } from "@/models/FlashcardQuiz";

export interface INewFlashcardQuizContext {
  flashcardQuiz: NewFlashcardQuizType;
  setFlashcardQuiz: ((quiz: NewFlashcardQuizType) => void);

  selectedFlashcardIndex: number;
  setSelectedFlashcardIndex: (index: number) => void;

  error: ZodError | null;
  setError: (error: ZodError | null) => void;
}

const NewFlashcardQuizContext = React.createContext<INewFlashcardQuizContext>({} as INewFlashcardQuizContext);

export default NewFlashcardQuizContext;
