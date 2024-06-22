import { Input, Textarea } from "@nextui-org/input";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/app/quizzes/new/components/primitives";

export function QuizInformationInput() {
  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Tell us about the quiz:</h2>
      <Input
        className={"mb-4"}
        label={"Title"}
        placeholder={"Quiz title"}
        type={"text"}
      />
      <Textarea label={"Description"} placeholder={"Describe your quiz"} />
    </div>
  );
}
