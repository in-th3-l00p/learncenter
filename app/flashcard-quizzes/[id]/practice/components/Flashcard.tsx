"use client";

import { useContext, useState } from "react";
import PracticeContext from "@/app/flashcard-quizzes/[id]/practice/context/PracticeContext";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import useShuffled from "@/hooks/useShuffled";

export default function Flashcard() {
  const { flashcardQuiz } = useContext(PracticeContext);

  const { item, next, prev, canPrev } = useShuffled(flashcardQuiz.flashcards);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <section className={"max-w-[800px] mx-auto mb-16"}>
      <Card className={"mb-16"}>
        <CardHeader>
          <h2 className={"text-lg font-bold"}>Flashcard {history.length}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className={"text-center"}>{item.question}</p>
        </CardBody>
        {showAnswer && (
          <>
            <Divider />
            <CardFooter>
              <p>Answer: {item.answer}</p>
            </CardFooter>
          </>
        )}
      </Card>

      <div className="flex flex-wrap justify-center gap-8">
        <Button
          type={"button"}
          disabled={canPrev()}
          onClick={() => {
            setShowAnswer(false);
            prev();
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
            next();
          }}
        >
          Next
        </Button>
      </div>
    </section>
  );
}