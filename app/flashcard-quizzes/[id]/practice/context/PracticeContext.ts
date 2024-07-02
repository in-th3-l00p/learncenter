"use client";

import React from "react";

import { FlashcardQuizType } from "@/models/FlashcardQuiz";

interface IPracticeContext {
  flashcardQuiz: FlashcardQuizType;
}

const PracticeContext = React.createContext<IPracticeContext>(
  {} as IPracticeContext,
);

export default PracticeContext;
