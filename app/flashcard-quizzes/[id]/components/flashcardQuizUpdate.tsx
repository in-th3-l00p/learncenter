"use client";

import { Button } from "@nextui-org/button";
import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";

import FlashcardQuizContext from "@/app/flashcard-quizzes/[id]/components/FlashcardQuizContext";
import { useBeforeUnloadHandler } from "@/components/utils/beforeUnloadHandler";
import { FlashcardQuizInformationInput } from "@/app/flashcard-quizzes/components/flashcardQuizInformationInput";
import FlashcardQuizFlashcards from "@/app/flashcard-quizzes/components/flashcardQuizFlashcards";
import { FlashcardQuizVisibility } from "@/app/flashcard-quizzes/components/flashcardQuizVisibility";
import { ZodError } from "zod";

export function FlashcardQuizUpdate({ initialFlashcardQuiz }: {
  initialFlashcardQuiz: string
}) {
  const {
    flashcardQuiz,
    setFlashcardQuiz,
    setError
  } = useContext(FlashcardQuizContext);
  const savedFlashcardQuiz = useRef(initialFlashcardQuiz);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const unsavedChangesCardRef = useRef<HTMLDivElement | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    setUnsavedChanges(
      savedFlashcardQuiz.current !== JSON.stringify(flashcardQuiz)
    );
  }, [flashcardQuiz]);

  useBeforeUnloadHandler(unsavedChanges);

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

      <FlashcardQuizInformationInput context={FlashcardQuizContext} />
      <FlashcardQuizFlashcards context={FlashcardQuizContext} />
      <FlashcardQuizVisibility context={FlashcardQuizContext} />

      <Button
        className={"mb-8 mx-auto flex items-center justify-center gap-4"}
        disabled={saving || !unsavedChanges}
        type={"button"}
        onClick={() => {
          setSaving(true);
          fetch(`/api/flashcard-quizzes/${flashcardQuiz._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(flashcardQuiz),
          })
            .then((res) => {
              if (!res.ok) throw res.json();

              return res.json();
            })
            .then((data) => {
              savedFlashcardQuiz.current = JSON.stringify(data);
              setFlashcardQuiz(data);
              setError(null);
            })
            .catch(async (err: Promise<ZodError>) => setError(await err))
            .finally(() => setSaving(false));
        }}
      >
        {saving && <Spinner color={"success"} size={"sm"} />}
        Save
      </Button>
    </div>
  );
}
