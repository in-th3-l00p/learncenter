import React from "react";
import { ZodError } from "zod";

import { QuizType } from "@/models/Quiz";

export type NewQuizType = Omit<QuizType, "owner" | "createdAt" | "_id">;

export interface IQuizContext {
  quiz: NewQuizType | QuizType;
  setQuiz: ((quiz: NewQuizType) => void) | ((quiz: QuizType) => void);

  selectedQuestionIndex: number;
  setSelectedQuestionIndex: (index: number) => void;

  selectedOptionIndex: number;
  setSelectedOptionIndex: (index: number) => void;

  error: ZodError | null;
  setError: (error: ZodError | null) => void;
}

const QuizContext = React.createContext<IQuizContext>({} as IQuizContext);

export default QuizContext;
