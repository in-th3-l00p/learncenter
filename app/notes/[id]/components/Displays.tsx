import { useContext, useEffect, useRef } from "react";
import { Input } from "@nextui-org/input";

import { INode } from "@/models/Node";
import EditorContext from "@/app/notes/[id]/context/EditorContext";
import { useNodeUtilities } from "@/app/notes/[id]/hooks/useNodeUtilities";

function ParagraphDisplay({ node }: { node: INode }) {
  const { updateNode } = useNodeUtilities();

  if (node.type !== "paragraph") return <></>;

  return (
    <Input
      type={"text"}
      value={node.children[0].attributes[0].value}
      onChange={(e) => {
        node.children[0].attributes[0].value = e.target.value;
        updateNode(node);
      }}
    />
  );
}

export function DivDisplay({ node }: { node: INode }) {
  const { nodeAdded, setNodeAdded } = useContext(EditorContext);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!nodeAdded || node.type !== "div" || node.children.length === 0) return;

    containerRef.current?.children[containerRef.current?.children.length - 1]
      .querySelector("input")
      ?.focus();
    setNodeAdded(false);
  }, [nodeAdded]);

  if (node.type !== "div") return <></>;

  if (node.children.length === 0) return <></>;

  return (
    <div ref={containerRef} className={"flex flex-col gap-8 mb-8"}>
      {node.children.map((child, index) => {
        switch (child.type) {
          case "paragraph":
            return <ParagraphDisplay key={index} node={child} />;
        }

        return <></>;
      })}
    </div>
  );
}
