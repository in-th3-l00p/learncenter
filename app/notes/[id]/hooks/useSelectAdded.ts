import { useContext, useEffect, useRef } from "react";

import EditorContext from "@/app/notes/[id]/context/EditorContext";
import { INode } from "@/models/Node";

export default function useSelectAdded(node: INode) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { nodeAdded, setNodeAdded } = useContext(EditorContext);

  useEffect(() => {
    if (!nodeAdded || node.type !== "div" || node.children.length === 0) return;

    const textarea =
      containerRef.current?.children[
        containerRef.current?.children.length - 1
      ].querySelector("textarea")!;

    textarea.select();
    textarea.selectionStart = textarea.value.length;
    textarea.selectionEnd = textarea.value.length;

    setNodeAdded(false);
  }, [nodeAdded]);

  return { containerRef };
}
