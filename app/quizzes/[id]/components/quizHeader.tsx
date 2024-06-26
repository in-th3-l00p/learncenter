"use client";

import { useContext } from "react";

import QuizContext from "@/app/quizzes/context/QuizContext";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { subtitle, title } from "@/components/primitives";
import { QuizType } from "@/models/Quiz";

export default function QuizHeader() {
  const { quiz } = useContext(QuizContext) as { quiz: QuizType };

  return (
    <div className={"mb-16"}>
      <PageBreadcrumbs
        back={"/dashboard#quizzes"}
        path={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Quizzes", href: "/dashboard#quizzes" },
          { title: `Quiz: "${quiz.title}"` },
        ]}
      />
      <h1 className={title()}>Quiz: {`"${quiz.title}"`}</h1>
      {quiz.createdAt && (
        <h2 className={subtitle()}>
          Created at: {new Date(quiz.createdAt).toLocaleDateString()}
        </h2>
      )}
      {quiz.description && (
        <h2 className={subtitle()}>Description: {quiz.description}</h2>
      )}
    </div>
  );
}
