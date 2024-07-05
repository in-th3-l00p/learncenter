"use client";

import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

export function DropdownSelector({
  backButtonTitle,
  nextButtonTitle,
  className,
  items,
  selected,
  setSelected,
  newOption,
  onNewOption,
}: {
  backButtonTitle?: string;
  nextButtonTitle?: string;
  className?: string;
  items: string[];
  selected: number;
  setSelected: (index: number) => void;
  newOption?: boolean;
  onNewOption?: () => void;
}) {
  const dropdownItems = items.map((item, index) => (
    <DropdownItem key={index}>{item}</DropdownItem>
  ));

  if (newOption)
    dropdownItems.push(
      <DropdownItem
        key={items.length}
        onClick={() => {
          if (!onNewOption) return;
          onNewOption();
        }}
      >
        Add new
      </DropdownItem>,
    );

  return (
    <div className={"flex gap-4 " + className}>
      <Button
        isIconOnly
        disabled={selected === 0}
        title={backButtonTitle}
        onClick={() => {
          if (selected === 0) return;
          setSelected(selected - 1);
        }}
      >
        <span className="text-lg">{"<"}</span>
      </Button>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className={"flex-grow w-full"}
            title={"Select question"}
            variant={"bordered"}
          >
            {items[selected || selected]}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label={"Select the question"}
          selectionMode={"single"}
          variant={"flat"}
          onSelectionChange={(selection) => {
            if (!(selection instanceof Set)) return;
            const selected = selection.values().next().value;

            if (selected >= items.length) return;
            setSelected(selected);
          }}
          className={"max-h-[300px] overflow-y-scroll"}
        >
          {dropdownItems}
        </DropdownMenu>
      </Dropdown>

      <Button
        isIconOnly
        disabled={selected === items.length - 1}
        title={nextButtonTitle}
        onClick={() => {
          if (selected === items.length - 1) return;
          setSelected(selected + 1);
        }}
      >
        <span className="text-lg">{">"}</span>
      </Button>
    </div>
  );
}
