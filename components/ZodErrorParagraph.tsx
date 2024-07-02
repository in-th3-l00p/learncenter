"use client";

import clsx from "clsx";

import { ZodError } from "zod";

export default function ZodErrorParagraph({
  error,
  className,
  path,
}: {
  error: ZodError | null;
  className?: string;
  path: (string | number)[];
}) {
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
