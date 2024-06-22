import React from "react";

import { QuizType } from "@/models/Quiz";

export type NewQuizType = Omit<QuizType, "owner" | "createdAt">;

export interface INewQuizContext {
  quiz: NewQuizType;
  setQuiz: (quiz: NewQuizType) => void;
}

const NewQuizContext = React.createContext<INewQuizContext | null>(null);

export default NewQuizContext;
