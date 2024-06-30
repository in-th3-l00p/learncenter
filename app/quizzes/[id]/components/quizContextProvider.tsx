"use client";

import React, { useState } from "react";
import { ZodError } from "zod";

import { QuizType } from "@/models/Quiz";
import QuizContext from "@/app/quizzes/new/context/QuizContext";

export default function QuizContextProvider({
  quiz,
  children,
}: {
  quiz: string;
  children: React.ReactNode;
}) {
  const [statefulQuiz, setStatefulQuiz] = useState<QuizType>(JSON.parse(quiz));

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [error, setError] = useState<ZodError | null>(null);

  return (
    <QuizContext.Provider
      value={{
        quiz: statefulQuiz,
        setQuiz: setStatefulQuiz,
        selectedQuestionIndex,
        setSelectedQuestionIndex,
        selectedOptionIndex,
        setSelectedOptionIndex,
        error,
        setError,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
