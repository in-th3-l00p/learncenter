"use client";

import React, { useContext } from "react";

import ZodErrorParagraph from "@/components/ZodErrorParagraph";
import { ZodError } from "zod";

export default function FlashcardQuizZodErrorParagraph<T>({
  context,
  className,
  path,
}: {
  context: React.Context<T>;
  className?: string;
  path: (string | number)[];
}) {
  const { error } = useContext(context) as {
    error: ZodError | null;
  };

  return <ZodErrorParagraph error={error} className={className} path={path} />
}
