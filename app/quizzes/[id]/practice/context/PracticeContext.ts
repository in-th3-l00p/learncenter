import React from "react";

import { QuizType } from "@/models/Quiz";

interface IPracticeContext {
  quiz: QuizType;
}

const PracticeContext = React.createContext<IPracticeContext>(
  {} as IPracticeContext,
);

export default PracticeContext;
