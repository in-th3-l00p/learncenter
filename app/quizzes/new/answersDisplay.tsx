import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";

import { DropdownSelector } from "@/app/quizzes/new/dropdownSelector";

function DesktopAnswerSelector() {
  return (
    <div
      className={"hidden sm:block rounded-2xl border-small border-content1 p-2"}
    >
      <Listbox
        aria-label={"Answers"}
        topContent={
          <Button className={"w-full mb-2"} title={"Add answer"}>
            <span className="text-lg">+</span>
          </Button>
        }
      >
        <ListboxItem key={1}>Answer 1</ListboxItem>
        <ListboxItem key={2}>Answer 2</ListboxItem>
        <ListboxItem key={3}>Answer 3</ListboxItem>
        <ListboxItem key={4}>Answer 4</ListboxItem>
        <ListboxItem key={5}>Answer 5</ListboxItem>
      </Listbox>
    </div>
  );
}

function MobileAnswerSelector() {
  return (
    <DropdownSelector
      className={"sm:hidden"}
      items={[
        { id: "1", name: "Answer 1" },
        { id: "2", name: "Answer 2" },
        { id: "3", name: "Answer 3" },
      ]}
      onChange={console.log}
    />
  );
}

export function AnswersDisplay({}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4">
      <DesktopAnswerSelector />
      <MobileAnswerSelector />

      <div className="flex-grow flex flex-col justify-between">
        <div>
          <Input
            className={"mb-4"}
            label={"Text"}
            placeholder={"Answer's text"}
            type={"text"}
          />

          <Checkbox className={"block mb-auto"}>Correct</Checkbox>
        </div>

        <div>
          <Button color={"danger"} title={"Delete answer"}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
