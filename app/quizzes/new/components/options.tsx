import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";

import { DropdownSelector } from "@/app/quizzes/new/components/dropdownSelector";

function DesktopOptionSelector() {
  return (
    <div
      className={"hidden sm:block rounded-2xl border-small border-content1 p-2"}
    >
      <Listbox
        aria-label={"Options"}
        topContent={
          <Button className={"w-full mb-2"} title={"Add option"}>
            <span className="text-lg">+</span>
          </Button>
        }
      >
        <ListboxItem key={1}>Option 1</ListboxItem>
        <ListboxItem key={2}>Option 2</ListboxItem>
        <ListboxItem key={3}>Option 3</ListboxItem>
        <ListboxItem key={4}>Option 4</ListboxItem>
        <ListboxItem key={5}>Option 5</ListboxItem>
      </Listbox>
    </div>
  );
}

function MobileOptionSelector() {
  return (
    <DropdownSelector
      className={"sm:hidden"}
      items={[
        { id: "1", name: "Option 1" },
        { id: "2", name: "Option 2" },
        { id: "3", name: "Option 3" },
      ]}
      onChange={console.log}
    />
  );
}

export function Options({}) {
  return (
    <div>
      <h3 className={"text-xl my-2"}>Options:</h3>
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <DesktopOptionSelector />
        <MobileOptionSelector />

        <div className="flex-grow flex flex-col justify-between">
          <div>
            <Input
              className={"mb-4"}
              label={"Text"}
              placeholder={"Option's text"}
              type={"text"}
            />

            <Checkbox className={"block mb-auto"}>Correct</Checkbox>
          </div>

          <div>
            <Button color={"danger"} title={"Delete option"}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
