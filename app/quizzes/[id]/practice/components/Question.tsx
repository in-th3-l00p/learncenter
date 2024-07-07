"use client";

import { useContext, useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import clsx from "clsx";

import PracticeContext from "@/app/quizzes/[id]/practice/context/PracticeContext";

export default function Question() {
  const { quiz } = useContext(PracticeContext);
  const [currentQuestion, setCurrentQuestion] = useState(
    Math.floor(Math.random() * quiz.questions.length),
  );
  const [answer, setAnswer] = useState(
    Array.from({ length: quiz.questions[currentQuestion].options.length }).map(
      () => false,
    ),
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);

  function checkAnswer() {
    let correct = true;

    quiz.questions[currentQuestion].options.forEach((option, index) => {
      if (option.isCorrect !== answer[index]) {
        correct = false;
      }
    });

    return correct;
  }

  useEffect(() => {
    if (!showAnswer) return;

    setShowAnswer(false);
    setShowingAnswer(true);
    setTimeout(() => {
      setCurrentQuestion(Math.floor(Math.random() * quiz.questions.length));
      setAnswer(
        Array.from({
          length: quiz.questions[currentQuestion].options.length,
        }).map(() => false),
      );
      setShowingAnswer(false);
    }, 2000);
  }, [showAnswer]);

  return (
    <section className={"max-w-[800px] mx-auto mb-16"}>
      <h2 className={"text-center text-2xl mb-8"}>
        {quiz.questions[currentQuestion].question}
      </h2>

      <div className={"mb-8 flex flex-col gap-8"}>
        {quiz.questions[currentQuestion].options.map((option, index) => (
          <Checkbox
            key={index}
            className={clsx(
              "rounded-lg",
              showingAnswer
                ? option.isCorrect
                  ? "bg-green-600"
                  : "bg-danger"
                : "",
            )}
            isSelected={answer[index]}
            readOnly={showingAnswer}
            onChange={(event) => {
              if (showingAnswer) return;
              let newAnswer = [...answer];

              newAnswer[index] = event.target.checked;
              setAnswer(newAnswer);
            }}
          >
            {option.option}
          </Checkbox>
        ))}
      </div>

      <Button
        className={"block mx-auto"}
        color={
          showingAnswer ? (checkAnswer() ? "success" : "danger") : "default"
        }
        disabled={showingAnswer}
        type={"button"}
        onClick={() => setShowAnswer(true)}
      >
        Next question
      </Button>
    </section>
  );
}
