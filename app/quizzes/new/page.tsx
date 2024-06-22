"use client";

import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Checkbox } from "@nextui-org/checkbox";
import { Select, SelectItem } from "@nextui-org/select";

import { subtitle, title } from "@/components/primitives";

function DesktopAnswerSelector() {
  return (
    <div className={"hidden sm:block rounded-2xl border-small p-2"}>
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
    <div className={"flex gap-4 sm:hidden"}>
      <Button isIconOnly title={"Last answer"}>
        <span className="text-lg">{"<"}</span>
      </Button>

      <Dropdown>
        <DropdownTrigger>
          <Button
            className={"flex-grow w-full"}
            title={"Select answer"}
            variant={"bordered"}
          >
            New answer
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label={"Select the answer"}
          selectionMode={"single"}
          variant={"flat"}
        >
          <DropdownItem value={1}>Answer 1</DropdownItem>
          <DropdownItem value={2}>Answer 2</DropdownItem>
          <DropdownItem value={3}>Answer 3</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Button isIconOnly title={"Next answer"}>
        <span className="text-lg">{">"}</span>
      </Button>
    </div>
  );
}

function AnswersDisplay({}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-8">
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

export default function NewQuiz() {
  return (
    <section>
      <div className={"mb-16"}>
        <h1 className={title()}>Create a new quiz</h1>
      </div>

      <div className={"max-w-[800px] mx-auto"}>
        <h2 className={subtitle()}>Tell us about the quiz:</h2>
        <Input
          className={"mb-4"}
          label={"Title"}
          placeholder={"Quiz title"}
          type={"text"}
        />
        <Textarea
          className={"mb-16"}
          label={"Description"}
          placeholder={"Describe your quiz"}
        />

        <h2 className={subtitle()}>Enter the quiz questions:</h2>

        <div className="flex gap-4 mb-8">
          <Button isIconOnly title={"Last question"}>
            <span className="text-lg">{"<"}</span>
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                className={"flex-grow w-full"}
                title={"Select question"}
                variant={"bordered"}
              >
                New question
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label={"Select the question"}
              selectionMode={"single"}
              variant={"flat"}
            >
              <DropdownItem value={"multiple-choice"}>
                Multiple choice
              </DropdownItem>
              <DropdownItem value={"true-false"}>True or false</DropdownItem>
              <DropdownItem value={"short-answer"}>Short answer</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button isIconOnly title={"Next question"}>
            <span className="text-lg">{">"}</span>
          </Button>
        </div>

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

        <div className={"mb-16"}>
          <h2 className={subtitle()}>Quiz settings:</h2>
          <Select
            defaultSelectedKeys={["public"]}
            label={"Visibility"}
            selectionMode={"single"}
          >
            <SelectItem key={"public"}>Public</SelectItem>
            <SelectItem key={"private"}>Private</SelectItem>
          </Select>
        </div>

        <Button className={"block mx-auto mb-16"}>Create</Button>
      </div>
    </section>
  );
}
