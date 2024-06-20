import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/input";

import NoteContext from "@/app/notes/[id]/NoteContext";
import { INode } from "@/models/Node";
import EditorContext from "@/app/notes/[id]/EditorContext";

// todo optimize
/*
 * currently, we re having a DFS traversal per update
 * we can optimize this by having a lookup table
 * where we can store the node id and its parent id
 * */
function useNodeUtilities() {
  const { rootNode, setRootNode } = useContext(NoteContext);

  return {
    updateNode: (node: INode) => {
      if (!rootNode) return;

      // todo implement lookup table (fk dfs)
      function traverse(currentNode: INode) {
        if (currentNode._id === node._id) {
          return node;
        }

        for (const child of currentNode.children) {
          const result = traverse(child);

          if (result !== null) {
            currentNode.children = currentNode.children.map((child) =>
              child._id === result._id ? result : child,
            );

            return currentNode;
          }
        }

        return null;
      }

      setRootNode(traverse({ ...rootNode }));
    },
  };
}

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

function DivDisplay({ node }: { node: INode }) {
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

let currentId = 1;

function EditorInput() {
  const { rootNode, setRootNode } = useContext(NoteContext);
  const { setNodeAdded } = useContext(EditorContext);
  const [inputValue, setInputValue] = useState("");

  function addNode(node: INode) {
    if (!rootNode) return;

    const newRootNode = {
      ...rootNode,
      children: [...rootNode.children, node],
    };

    setRootNode(newRootNode);
  }

  return (
    <Input
      type={"text"}
      value={inputValue}
      onChange={async (e) => {
        if (!rootNode) return;

        addNode({
          _id: (currentId++).toString(),
          type: "paragraph",
          attributes: [],
          children: [
            {
              _id: (currentId++).toString(),
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

export default function Editor() {
  const { rootNode } = useContext(NoteContext);
  const [nodeAdded, setNodeAdded] = useState(false);

  return (
    <EditorContext.Provider value={{ nodeAdded, setNodeAdded }}>
      <div className={"w-full"}>
        <DivDisplay node={rootNode} />
        <EditorInput />
      </div>
    </EditorContext.Provider>
  );
}
