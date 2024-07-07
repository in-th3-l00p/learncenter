"use client";

import { useContext, useState } from "react";
import PracticeContext from "@/app/flashcard-quizzes/[id]/practice/context/PracticeContext";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";

export default function Flashcard() {
  const { flashcardQuiz } = useContext(PracticeContext);

  const [showAnswer, setShowAnswer] = useState(false);

  const [history, setHistory] = useState<number[]>([
    Math.floor(Math.random() * flashcardQuiz.flashcards.length),
  ]);
  const [selectedFlashcard, setSelectedFlashcard] = useState<number>(0);

  return (
    <section className={"max-w-[800px] mx-auto mb-16"}>
      <Card className={"mb-16"}>
        <CardHeader>
          <h2 className={"text-lg font-bold"}>Flashcard {history.length}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className={"text-center"}>
            {flashcardQuiz
              .flashcards[history[selectedFlashcard]]
              .question}
          </p>
        </CardBody>
        {showAnswer && (
          <>
            <Divider />
            <CardFooter>
              <p>Answer: {flashcardQuiz.flashcards[history[selectedFlashcard]].answer}</p>
            </CardFooter>
          </>
        )}
      </Card>

      <div className="flex flex-wrap justify-center gap-8">
        <Button
          type={"button"}
          disabled={selectedFlashcard === 0}
          onClick={() => {
            setShowAnswer(false);
            setSelectedFlashcard(selectedFlashcard - 1)
          }}
        >
          Previous
        </Button>

        <Button
          type={"button"}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? "Hide" : "Show"} answer
        </Button>

        <Button
          type={"button"}
          onClick={() => {
            setShowAnswer(false);
            if (selectedFlashcard === history.length - 1)
              setHistory([
                ...history,
                Math.floor(Math.random() * flashcardQuiz.flashcards.length)]
              );
            setSelectedFlashcard(selectedFlashcard + 1);
          }}
        >
          Next
        </Button>
      </div>
    </section>
  );
}