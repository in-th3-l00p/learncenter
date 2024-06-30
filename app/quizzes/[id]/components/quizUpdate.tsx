"use client";

import { Button } from "@nextui-org/button";
import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";

import { QuizInformationInput } from "@/app/quizzes/new/components/quizInformationInput";
import { Questions } from "@/app/quizzes/new/components/questions";
import { QuizVisibility } from "@/app/quizzes/new/components/quizVisibility";
import QuizContext from "@/app/quizzes/new/context/QuizContext";
import { QuizType } from "@/models/Quiz";

export function QuizUpdate({ initialQuiz }: { initialQuiz: string }) {
  const { quiz, setQuiz } = useContext(QuizContext) as {
    quiz: QuizType;
    setQuiz: (quiz: QuizType) => void;
  };
  const savedQuiz = useRef(initialQuiz);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const unsavedChangesCardRef = useRef<HTMLDivElement | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    setUnsavedChanges(savedQuiz.current !== JSON.stringify(quiz));
  }, [quiz]);

  const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    let confirmationMessage =
      "You have unsaved progress." +
      "If you leave before saving, your changes will be lost.";

    e.returnValue = confirmationMessage; //Gecko + IE

    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  };

  useEffect(() => {
    if (!unsavedChanges) {
      window.removeEventListener("beforeunload", beforeUnloadHandler);

      return;
    }

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [unsavedChanges]);

  return (
    <div className={"max-w-[800px] mx-auto"}>
      {unsavedChanges && (
        <Card
          ref={unsavedChangesCardRef}
          className={"ms-4 mb-4 fixed z-40 bottom-0 left-0"}
        >
          <CardBody>You have unsaved changes</CardBody>
        </Card>
      )}

      <QuizInformationInput />
      <Questions />
      <QuizVisibility />

      <Button
        className={"mb-8 mx-auto flex items-center justify-center gap-4"}
        disabled={saving || !unsavedChanges}
        type={"button"}
        onClick={() => {
          setSaving(true);
          fetch(`/api/quizzes/${quiz._id}`, {
            method: "PUT",
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
              savedQuiz.current = JSON.stringify(data);
              setQuiz(data);
            })
            .finally(() => setSaving(false));
        }}
      >
        {saving && <Spinner color={"success"} size={"sm"} />}
        Save
      </Button>
    </div>
  );
}
