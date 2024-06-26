import { Input, Textarea } from "@nextui-org/input";
import { useContext } from "react";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/app/quizzes/components/primitives";
import QuizContext from "@/app/quizzes/context/QuizContext";
import ZodErrorParagraph from "@/components/ZodErrorParagraph";

export function QuizInformationInput() {
  const { quiz, setQuiz } = useContext(QuizContext);

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Tell us about the quiz:</h2>

      <ZodErrorParagraph path={["title"]} />
      <Input
        className={"mb-4"}
        label={"Title"}
        placeholder={"Quiz title"}
        type={"text"}
        value={quiz.title}
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
      />

      <ZodErrorParagraph path={["description"]} />
      <Textarea
        label={"Description"}
        placeholder={"Describe your quiz"}
        value={quiz.description}
        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
      />
    </div>
  );
}
