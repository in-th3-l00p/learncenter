"use client";

import { useContext } from "react";

import ZodErrorParagraph from "@/components/ZodErrorParagraph";
import FlashcardQuizContext from "@/app/flashcard-quizzes/context/FlashcardQuizContext";

export default function FlashcardQuizZodErrorParagraph({
  className,
  path,
}: {
  className?: string;
  path: (string | number)[];
}) {
  const { error } = useContext(FlashcardQuizContext);

  return <ZodErrorParagraph error={error} className={className} path={path} />
}
