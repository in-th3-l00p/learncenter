"use client";

import { QuizInformationInput } from "@/app/quizzes/components/quizInformationInput";
import { Questions } from "@/app/quizzes/components/questions";
import { QuizVisibility } from "@/app/quizzes/components/quizVisibility";

export function QuizUpdate() {
  return (
    <div className={"max-w-[800px] mx-auto"}>
      <QuizInformationInput />
      <Questions />
      <QuizVisibility />
    </div>
  );
}
