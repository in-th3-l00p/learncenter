"use client";

import { useContext } from "react";

import QuizContext from "@/app/quizzes/context/QuizContext";
import ZodErrorParagraph from "@/components/ZodErrorParagraph";

export default function QuizZodErrorParagraph({
  className,
  path,
}: {
  className?: string;
  path: (string | number)[];
}) {
  const { error } = useContext(QuizContext);

  return <ZodErrorParagraph error={error} className={className} path={path} />
}
