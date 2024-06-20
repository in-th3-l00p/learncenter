import { useContext, useState } from "react";
import { Input } from "@nextui-org/input";

import NoteContext from "@/app/notes/[id]/context/NoteContext";
import EditorContext from "@/app/notes/[id]/context/EditorContext";
import { useNodeUtilities } from "@/app/notes/[id]/hooks/useNodeUtilities";

export function EditorInput() {
  const { rootNode } = useContext(NoteContext);
  const { setNodeAdded } = useContext(EditorContext);
  const [inputValue, setInputValue] = useState("");
  const { createId, addNode } = useNodeUtilities();

  return (
    <Input
      type={"text"}
      value={inputValue}
      onChange={async (e) => {
        if (!rootNode) return;

        addNode({
          _id: createId(),
          type: "paragraph",
          attributes: [],
          children: [
            {
              _id: createId(),
              type: "text",
              attributes: [
                {
                  key: "text",
                  value: e.target.value,
                },
              ],
              children: [],
            },
          ],
        });

        setNodeAdded(true);
        setInputValue("");
      }}
    />
  );
}
