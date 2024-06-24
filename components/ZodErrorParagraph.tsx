"use client";

import { useContext } from "react";
import clsx from "clsx";

import NewQuizContext from "@/app/quizzes/new/context/NewQuizContext";

export default function ZodErrorParagraph({
  className,
  path,
}: {
  className?: string;
  path: (string | number)[];
}) {
  const { error } = useContext(NewQuizContext);

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
