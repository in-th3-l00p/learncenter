import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import clsx from "clsx";

import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { subtitle } from "@/components/primitives";
import { QuizUpdate } from "@/app/quizzes/[id]/components/quizUpdate";
import QuizContextProvider from "@/app/quizzes/[id]/components/quizContextProvider";
import QuizHeader from "@/app/quizzes/[id]/components/quizHeader";
import QuizDelete from "@/app/quizzes/[id]/components/quizDelete";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { StartButton } from "@/app/components/startButton";

export default async function QuizDisplay({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  const quiz = await Quiz.findById(params.id);

  if (!quiz.owner.equals(user._id)) return redirect(`/quizzes?unauthorized`);

  quiz._id = quiz._id.toString();

  return (
    <QuizContextProvider quiz={JSON.stringify(quiz)}>
      <section>
        <QuizHeader />

        <div className={"mb-16"}>
          <h2 className={subtitle()}>Start learning:</h2>

          <div className={"flex justify-around"}>
            <StartButton
              href={`/quizzes/${quiz._id}/practice`}
              icon={"/icons/practice.svg"}
              iconAlt={"Practice"}
            >
              Practice
            </StartButton>
          </div>
        </div>

        <h2 className={clsx(subtitle(), "mb-4")}>Edit quiz:</h2>
        <QuizUpdate initialQuiz={JSON.stringify(quiz)} />

        <QuizDelete />
      </section>
    </QuizContextProvider>
  );
}
