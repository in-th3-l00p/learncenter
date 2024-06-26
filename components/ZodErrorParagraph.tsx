"use client";

import { useContext } from "react";
import clsx from "clsx";

import QuizContext from "@/app/quizzes/context/QuizContext";

export default function ZodErrorParagraph({
  className,
  path,
}: {
  className?: string;
  path: (string | number)[];
}) {
  const { error } = useContext(QuizContext);

  if (error === null) return <></>;

  const issues = error.issues.filter(
    (issue) => issue.path.join(".") === path.join("."),
  );

  if (issues.length === 0) return <></>;

  return (
    <div className={clsx("mb-2", className)}>
      {issues.map((issue, index) => (
        <p key={index} className={"text-danger"}>
          {issue.message}
        </p>
      ))}
    </div>
  );
}
