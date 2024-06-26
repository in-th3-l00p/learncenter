import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import React from "react";
import clsx from "clsx";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { subtitle } from "@/components/primitives";
import { QuizUpdate } from "@/app/quizzes/[id]/components/quizUpdate";
import QuizContextProvider from "@/app/quizzes/[id]/components/quizContextProvider";
import QuizHeader from "@/app/quizzes/[id]/components/quizHeader";
import QuizDelete from "@/app/quizzes/[id]/components/quizDelete";

function StartButton({
  icon,
  iconAlt,
  href,
  children,
  soon,
}: {
  icon: string;
  iconAlt: string;
  href: string;
  children: string;
  soon?: boolean;
}) {
  if (soon)
    return (
      <Button
        className={
          "w-64 h-64 flex flex-col justify-center items-center gap-2 relative"
        }
        disabled={true}
      >
        <img alt={iconAlt} className={"w-16 h-16 invert"} src={icon} />
        {children}

        <div
          className={clsx(
            "w-full h-full absolute z-10 top-0 left-0",
            "rounded-lg bg-white dark:bg-black bg-opacity-75",
            "flex justify-center items-center",
            "text-xl font-bold",
          )}
        >
          Soon...
        </div>
      </Button>
    );

  return (
    <Button
      as={Link}
      className={"w-64 h-64 flex flex-col justify-center items-center gap-2"}
      href={href}
    >
      <img alt={iconAlt} className={"w-16 h-16 invert"} src={icon} />
      {children}
    </Button>
  );
}

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
          <h2 className={subtitle()}>Start learning</h2>

          <div className={"flex justify-around"}>
            <StartButton
              href={`/quizzes/${quiz._id}/practice`}
              icon={"/icons/practice.svg"}
              iconAlt={"Practice"}
            >
              Practice
            </StartButton>
            <StartButton
              href={`/quizzes/${quiz._id}/test`}
              icon={"/icons/test.svg"}
              iconAlt={"Test"}
              soon={true}
            >
              Test
            </StartButton>
          </div>
        </div>

        <h2 className={clsx(subtitle(), "mb-4")}>Edit quiz</h2>
        <QuizUpdate initialQuiz={JSON.stringify(quiz)} />

        <QuizDelete />
      </section>
    </QuizContextProvider>
  );
}
