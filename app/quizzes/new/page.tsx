"use client";

import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { title } from "@/components/primitives";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { QuizInformationInput } from "@/app/quizzes/components/quizInformationInput";
import { Questions } from "@/app/quizzes/components/questions";
import { QuizVisibility } from "@/app/quizzes/components/quizVisibility";
import QuizContext, { NewQuizType } from "@/app/quizzes/new/context/QuizContext";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import LoadingPage from "@/components/loadingPage";
import { QuizGenerator } from "@/app/quizzes/new/components/quizGenerator";

const defaultQuiz: NewQuizType = {
  title: "",
  description: "",
  questions: [
    {
      question: "",
      description: "",
      options: [
        {
          option: "",
          isCorrect: false,
        },
      ],
    },
  ],
  visibility: "public",
};

export default function NewQuiz() {
  const session = useSession();
  const router = useRouter();
  const [quiz, setQuiz, quizLoading] = useLocalStorageState<NewQuizType>(
    "new-quiz",
    defaultQuiz,
  );
  const [selectedQuestionIndex, setSelectedQuestionIndex, questionLoading] =
    useLocalStorageState<number>("selected-question-index", 0);
  const [selectedOptionIndex, setSelectedOptionIndex, optionLoading] =
    useLocalStorageState<number>("selected-option-index", 0);
  const [error, setError] = useState<ZodError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (
      session.status === "loading" ||
      quizLoading ||
      questionLoading ||
      optionLoading
    )
      return;
    if (session.status === "unauthenticated") {
      router.push("/api/auth/signin");

      return;
    }
    setLoading(false);
  }, [session, quizLoading, questionLoading, optionLoading]);

  if (loading) return <LoadingPage />;

  return (
    <QuizContext.Provider
      value={{
        quiz,
        setQuiz,
        selectedQuestionIndex,
        setSelectedQuestionIndex,
        selectedOptionIndex,
        setSelectedOptionIndex,
        error,
        setError,
      }}
    >
      <section>
        <div className={"mb-16"}>
          <PageBreadcrumbs
            back={"/dashboard#quizzes"}
            path={[
              { title: "Dashboard", href: "/dashboard" },
              { title: "Quizzes", href: "/dashboard#quizzes" },
              { title: "New quiz" },
            ]}
          />
          <h1 className={title()}>Create a new quiz</h1>
        </div>

        <div className={"max-w-[800px] mx-auto"}>
          <QuizGenerator />
          <QuizInformationInput />
          <Questions />
          <QuizVisibility />

          <Button
            className={"block mx-auto mb-16"}
            type={"button"}
            onClick={() => {
              setLoading(true);
              fetch("/api/quizzes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(quiz),
              })
                .then((res) => {
                  if (!res.ok) throw res;

                  return res.json();
                })
                .then((data) => {
                  setQuiz(defaultQuiz);
                  setSelectedQuestionIndex(0);
                  setSelectedOptionIndex(0);
                  localStorage.removeItem("new-quiz");
                  localStorage.removeItem("selected-question-index");
                  localStorage.removeItem("selected-option-index");
                  setError(null);
                  router.push(`/quizzes/${data._id}`);
                })
                .catch(async (resp) => {
                  setError(await resp.json());
                  setLoading(false);
                });
            }}
          >
            Create
          </Button>
        </div>
      </section>
    </QuizContext.Provider>
  );
}
