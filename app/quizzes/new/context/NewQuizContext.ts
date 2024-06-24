import React from "react";
import { ZodError } from "zod";

import { QuizType } from "@/models/Quiz";

export type NewQuizType = Omit<QuizType, "owner" | "createdAt" | "_id">;

export interface INewQuizContext {
  quiz: NewQuizType;
  setQuiz: (quiz: NewQuizType) => void;

  selectedQuestionIndex: number;
  setSelectedQuestionIndex: (index: number) => void;

  selectedOptionIndex: number;
  setSelectedOptionIndex: (index: number) => void;

  error: ZodError | null;
  setError: (error: ZodError | null) => void;
}

const NewQuizContext = React.createContext<INewQuizContext>(
  {} as INewQuizContext,
);

export default NewQuizContext;
