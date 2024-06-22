import { Input, Textarea } from "@nextui-org/input";

import { subtitle } from "@/components/primitives";

export function QuizInformationInput() {
  return (
    <div className="mb-16">
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
