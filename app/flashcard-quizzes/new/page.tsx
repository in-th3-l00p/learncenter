"use client";

import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { title } from "@/components/primitives";
import { NewFlashcardQuizType } from "@/models/FlashcardQuiz";
import FlashcardQuizContext from "@/app/flashcard-quizzes/new/context/FlashcardQuizContext";
import { ZodError } from "zod";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { FlashcardQuizVisibility } from "@/app/flashcard-quizzes/new/components/flashcardQuizVisibility";
import { FlashcardQuizInformationInput } from "@/app/flashcard-quizzes/new/components/flashcardQuizInformationInput";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import LoadingPage from "@/components/loadingPage";

const defaultFlashcardQuiz: NewFlashcardQuizType = {
  title: "",
  description: "",
  flashcards: [
    {
      question: "",
      answer: ""
    }
  ],
  visibility: "public"
};

export default function NewFlashcardQuiz() {
  const [flashcardQuiz, setFlashcardQuiz, flashcardQuizLoading] = useLocalStorageState<NewFlashcardQuizType>("new-flashcard-quiz", defaultFlashcardQuiz);
  const [error, setError] = useState<ZodError | null>(null);

  if (flashcardQuizLoading)
    return <LoadingPage />;
  return (
    <FlashcardQuizContext.Provider value={{
      flashcardQuiz, setFlashcardQuiz,
      error, setError
    }}>
      <section>
        <div className={"mb-16"}>
          <PageBreadcrumbs
            back={"/dashboard#quizzes"}
            path={[
              { title: "Dashboard", href: "/dashboard" },
              { title: "Flashcard Quizzes", href: "/dashboard#flashcard-quizzes" },
              { title: "New flashcard quiz" }
            ]}
          />
          <h1 className={title()}>Create a new flashcard quiz</h1>
        </div>

        <div className={"max-w-[800px] mx-auto"}>
          <FlashcardQuizInformationInput />
          <FlashcardQuizVisibility />

          <Button
            className={"block mx-auto mb-8"}
            type={"button"}
            onClick={() => {
            }}
          >
            Create
          </Button>
        </div>
      </section>
    </FlashcardQuizContext.Provider>
  );
}