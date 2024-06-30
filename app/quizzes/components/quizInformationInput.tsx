import { Input, Textarea } from "@nextui-org/input";
import { useContext } from "react";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/components/NewForm/primitives";
import QuizContext, { NewQuizType } from "@/app/quizzes/context/QuizContext";
import QuizZodErrorParagraph from "@/app/quizzes/components/QuizZodErrorParagraph";

export function QuizInformationInput() {
  const { quiz, setQuiz } = useContext(QuizContext) as {
    quiz: NewQuizType;
    setQuiz: (quiz: NewQuizType) => void;
  };

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Tell us about the quiz:</h2>

      <QuizZodErrorParagraph path={["title"]} />
      <Input
        className={"mb-4"}
        label={"Title"}
        placeholder={"Quiz title"}
        type={"text"}
        value={quiz.title}
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
      />

      <QuizZodErrorParagraph path={["description"]} />
      <Textarea
        label={"Description"}
        placeholder={"Describe your quiz"}
        value={quiz.description}
        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
      />
    </div>
  );
}
