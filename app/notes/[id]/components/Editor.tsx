import { useContext, useState } from "react";

import NoteContext from "@/app/notes/[id]/context/NoteContext";
import EditorContext from "@/app/notes/[id]/context/EditorContext";
import { EditorInput } from "@/app/notes/[id]/components/EditorInput";
import { DivDisplay } from "@/app/notes/[id]/components/Displays";

export default function Editor() {
  const { rootNode } = useContext(NoteContext);
  const [nodeAdded, setNodeAdded] = useState(false);

  if (!rootNode) return <></>;

  return (
    <EditorContext.Provider value={{ nodeAdded, setNodeAdded }}>
      <div className={"w-full"}>
        <DivDisplay node={rootNode} />
        <EditorInput />
      </div>
    </EditorContext.Provider>
  );
}
