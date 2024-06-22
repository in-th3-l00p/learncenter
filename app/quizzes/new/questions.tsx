import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { AnswersDisplay } from "@/app/quizzes/new/answersDisplay";
import { subtitle } from "@/components/primitives";
import { DropdownSelector } from "@/app/quizzes/new/dropdownSelector";

function QuestionDisplay() {
  return (
    <div className={"mb-16"}>
      <Input
        className={"mb-4"}
        label={"Question"}
        placeholder={"Question"}
        type={"text"}
      />
      <Textarea
        className={"mb-8"}
        label={"Description"}
        placeholder={"Description"}
        type={"text"}
      />

      <div className={"mb-8"}>
        <h3 className={"text-xl my-2"}>Correct answers:</h3>

        <div className="flex flex-wrap gap-4">
          <Button size={"sm"}>Answer 1</Button>
          <Button size={"sm"}>Answer 2</Button>
          <Button size={"sm"}>Answer 3</Button>
          <Button size={"sm"}>Answer 4</Button>
        </div>
      </div>

      <div>
        <h3 className={"text-xl my-2"}>Answers:</h3>
        <AnswersDisplay />
      </div>
    </div>
  );
}

export function Questions() {
  return (
    <div>
      <h2 className={subtitle()}>Enter the quiz questions:</h2>

      <DropdownSelector
        className={"mb-4"}
        items={[
          { id: "1", name: "Question 1" },
          { id: "2", name: "Question 2" },
          { id: "3", name: "Question 3" },
        ]}
        onChange={console.log}
      />

      <QuestionDisplay />
    </div>
  );
}
