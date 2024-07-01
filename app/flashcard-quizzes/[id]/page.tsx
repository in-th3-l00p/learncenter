import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import User from "@/models/User";
import FlashcardQuizContextProvider from "@/app/flashcard-quizzes/[id]/components/FlashcardQuizContextProvider";
import FlashcardQuizHeader from "@/app/flashcard-quizzes/[id]/components/flashcardQuizHeader";
import FlashcardQuiz from "@/models/FlashcardQuiz";
import { FlashcardQuizUpdate } from "@/app/flashcard-quizzes/[id]/components/flashcardQuizUpdate";
import clsx from "clsx";
import { subtitle } from "@/components/primitives";
import React from "react";
import FlashcardQuizDelete from "@/app/flashcard-quizzes/[id]/components/flashcardQuizDelete";

export default async function FlashcardQuizDisplay({ params }: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  const flashcardQuiz = await FlashcardQuiz.findById(params.id);

  if (!flashcardQuiz.owner.equals(user._id)) return redirect(`/quizzes?unauthorized`);

  flashcardQuiz._id = flashcardQuiz._id.toString();

  return (
    <FlashcardQuizContextProvider
      flashcardQuiz={JSON.stringify(flashcardQuiz)}
    >
      <section>
        <FlashcardQuizHeader />
      </section>

      <h2 className={clsx(subtitle(), "mb-4")}>Edit flashcard quiz:</h2>
      <FlashcardQuizUpdate
        initialFlashcardQuiz={JSON.stringify(flashcardQuiz)}
      />

      <FlashcardQuizDelete />
    </FlashcardQuizContextProvider>
  )
}