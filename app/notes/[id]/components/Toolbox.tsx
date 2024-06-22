"use client";

import clsx from "clsx";
import { Button } from "@nextui-org/button";
import { useContext } from "react";

import EditorContext from "@/app/notes/[id]/context/EditorContext";

export default function Toolbox() {
  const { toolboxState, setToolboxState } = useContext(EditorContext);

  return (
    <div className={clsx("w-full rounded-2xl bg-content2 mb-8 p-3")}>
      <h2 className={"text-small mb-2"}>Toolbox</h2>
      <div className={"flex flex-wrap gap-2"}>
        <Button
          isIconOnly
          title={"Bold"}
          variant={toolboxState.bold ? "faded" : "solid"}
          onClick={() =>
            setToolboxState({ ...toolboxState, bold: !toolboxState.bold })
          }
        >
          <span className="font-bold">B</span>
        </Button>

        <Button
          isIconOnly
          title={"Italic"}
          variant={toolboxState.italic ? "faded" : "solid"}
          onClick={() =>
            setToolboxState({ ...toolboxState, italic: !toolboxState.italic })
          }
        >
          <span className="italic">I</span>
        </Button>

        <Button
          isIconOnly
          title={"Underline"}
          variant={toolboxState.underline ? "faded" : "solid"}
          onClick={() =>
            setToolboxState({
              ...toolboxState,
              underline: !toolboxState.underline,
            })
          }
        >
          <span className="underline">U</span>
        </Button>
      </div>
    </div>
  );
}
