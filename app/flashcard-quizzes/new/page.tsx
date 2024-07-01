"use client";

import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { title } from "@/components/primitives";
import { NewFlashcardQuizType } from "@/models/FlashcardQuiz";
import NewFlashcardQuizContext from "@/app/flashcard-quizzes/new/context/NewFlashcardQuizContext";
import { ZodError } from "zod";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { FlashcardQuizVisibility } from "@/app/flashcard-quizzes/components/flashcardQuizVisibility";
import { FlashcardQuizInformationInput } from "@/app/flashcard-quizzes/components/flashcardQuizInformationInput";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import LoadingPage from "@/components/loadingPage";
import FlashcardQuizFlashcards from "@/app/flashcard-quizzes/components/flashcardQuizFlashcards";
import { useRouter } from "next/navigation";

const defaultFlashcardQuiz: NewFlashcardQuizType = {
  title: "",
  description: "",
  flashcards: [
    {
      question: "",
      answer: ""
    }
  ],
  visibility: "public",
  owner: ""
};

export default function NewFlashcardQuiz() {
  const router = useRouter();
  const [
    flashcardQuiz,
    setFlashcardQuiz,
    flashcardQuizLoading
  ] = useLocalStorageState<NewFlashcardQuizType>("new-flashcard-quiz", defaultFlashcardQuiz);
  const [
    selectedFlashcardIndex,
    setSelectedFlashcardIndex,
    selectedFlashcardIndexLoading
  ] = useLocalStorageState<number>("selected-flashcard-index", 0);

  const [error, setError] = useState<ZodError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (
    loading ||
    flashcardQuizLoading ||
    selectedFlashcardIndexLoading
  )
    return <LoadingPage />;
  return (
    <NewFlashcardQuizContext.Provider value={{
      flashcardQuiz, setFlashcardQuiz,
      selectedFlashcardIndex, setSelectedFlashcardIndex,
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
          <FlashcardQuizInformationInput context={NewFlashcardQuizContext} />
          <FlashcardQuizFlashcards context={NewFlashcardQuizContext} />
          <FlashcardQuizVisibility context={NewFlashcardQuizContext} />

          <Button
            className={"block mx-auto mb-16"}
            type={"button"}
            onClick={() => {
              setLoading(true);
              fetch("/api/flashcard-quizzes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(flashcardQuiz),
              })
                .then((res) => {
                  if (!res.ok) throw res;

                  return res.json();
                })
                .then((data) => {
                  localStorage.removeItem("new-flashcard-quiz");
                  localStorage.removeItem("selected-flashcard-index");
                  setError(null);
                  router.push(`/flashcard-quizzes/${data._id}`);
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
    </NewFlashcardQuizContext.Provider>
  );
}