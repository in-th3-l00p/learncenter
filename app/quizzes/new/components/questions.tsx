import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { Options } from "@/app/quizzes/new/components/options";
import { subtitle } from "@/components/primitives";
import { DropdownSelector } from "@/app/quizzes/new/components/dropdownSelector";
import { spacing } from "@/app/quizzes/new/components/primitives";

function QuestionDisplay() {
  return (
    <div className={"mb-8"}>
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

      <div>
        <h3 className={"text-xl my-2"}>Answers:</h3>

        <div className="flex flex-wrap gap-4">
          <Button size={"sm"}>Option 1</Button>
          <Button size={"sm"}>Option 2</Button>
          <Button size={"sm"}>Option 3</Button>
          <Button size={"sm"}>Option 4</Button>
        </div>
      </div>
    </div>
  );
}

export function Questions() {
  return (
    <div className={spacing()}>
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

      <Options />
    </div>
  );
}
