import React from "react";

import { QuizType } from "@/models/Quiz";

export type NewQuizType = Omit<QuizType, "owner" | "createdAt">;

export interface INewQuizContext {
  quiz: NewQuizType;
  setQuiz: (quiz: NewQuizType) => void;

  selectedQuestionIndex: number;
  setSelectedQuestionIndex: (index: number) => void;

  selectedOptionIndex: number;
  setSelectedOptionIndex: (index: number) => void;
}

const NewQuizContext = React.createContext<INewQuizContext>(
  {} as INewQuizContext,
);

export default NewQuizContext;
