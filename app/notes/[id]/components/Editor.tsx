import { useContext, useState } from "react";

import NoteContext from "@/app/notes/[id]/context/NoteContext";
import EditorContext, {
  ToolboxState,
} from "@/app/notes/[id]/context/EditorContext";
import { EditorInput } from "@/app/notes/[id]/components/EditorInput";
import { RootDisplay } from "@/app/notes/[id]/components/Displays";
import Toolbox from "@/app/notes/[id]/components/Toolbox";

export default function Editor() {
  const { rootNode } = useContext(NoteContext);

  const [nodeAdded, setNodeAdded] = useState(false);
  const [toolboxState, setToolboxState] = useState<ToolboxState>({
    bold: false,
    italic: false,
    underline: false,
  });

  if (!rootNode) return <></>;

  return (
    <EditorContext.Provider
      value={{ nodeAdded, setNodeAdded, toolboxState, setToolboxState }}
    >
      <Toolbox />
      <RootDisplay node={rootNode} />
      <EditorInput />
    </EditorContext.Provider>
  );
}
