import { Textarea } from "@nextui-org/input";

import { INode } from "@/models/Node";
import { useNodeUtilities } from "@/app/notes/[id]/hooks/useNodeUtilities";
import useSelectAdded from "@/app/notes/[id]/hooks/useSelectAdded";

function ParagraphDisplay({ node }: { node: INode }) {
  const { updateNode } = useNodeUtilities();

  if (node.type !== "paragraph") return <></>;

  return (
    <Textarea
      maxRows={100000}
      minRows={1}
      type={"text"}
      value={node.children[0].attributes[0].value}
      onChange={(e) => {
        node.children[0].attributes[0].value = e.target.value;
        updateNode(node);
      }}
    >
      {node.children[0].attributes[0].value}
    </Textarea>
  );
}

export function RootDisplay({ node }: { node: INode }) {
  const { containerRef } = useSelectAdded(node);

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
