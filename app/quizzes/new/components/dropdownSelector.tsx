"use client";

import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useEffect, useState } from "react";

export function DropdownSelector({
  backButtonTitle,
  nextButtonTitle,
  onChange,
  className,
  items,
}: {
  backButtonTitle?: string;
  nextButtonTitle?: string;
  className?: string;
  onChange: (id: string) => void;
  items: {
    id: string;
    name: string;
  }[];
}) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    onChange(items[selected].id);
  }, [selected]);

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
            {items[selected].name}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label={"Select the question"}
          selectionMode={"single"}
          variant={"flat"}
          onSelectionChange={(selection) => {
            if (!(selection instanceof Set)) return;
            setSelected(selection.values().next().value);
          }}
        >
          {items.map((item, index) => (
            <DropdownItem key={index}>{item.name}</DropdownItem>
          ))}
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
