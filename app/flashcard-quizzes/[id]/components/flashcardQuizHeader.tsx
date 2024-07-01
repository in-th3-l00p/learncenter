"use client";

import { useContext } from "react";

import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { subtitle, title } from "@/components/primitives";
import FlashcardQuizContext from "@/app/flashcard-quizzes/[id]/components/FlashcardQuizContext";

export default function FlashcardQuizHeader() {
  const { flashcardQuiz } = useContext(FlashcardQuizContext);

  return (
    <div className={"mb-16"}>
      <PageBreadcrumbs
        back={"/dashboard#flashcard-quizzes"}
        path={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Flashcard quizzes", href: "/dashboard#flashcard-quizzes" },
          { title: `Flashcard quiz: "${flashcardQuiz.title}"` },
        ]}
      />
      <h1 className={title()}>Flashcard quiz: {`"${flashcardQuiz.title}"`}</h1>
      {flashcardQuiz.createdAt && (
        <h2 className={subtitle()}>
          Created at: {new Date(flashcardQuiz.createdAt).toLocaleDateString()}
        </h2>
      )}
      {flashcardQuiz.description && (
        <h2 className={subtitle()}>Description: {flashcardQuiz.description}</h2>
      )}
    </div>
  );
}
