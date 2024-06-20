import { useContext, useRef } from "react";

import NoteContext from "@/app/notes/[id]/context/NoteContext";
import { INode } from "@/models/Node";

// todo optimize
/*
 * currently, we re having a DFS traversal per update
 * we can optimize this by having a lookup table
 * where we can store the node id and its parent id
 * */
export function useNodeUtilities() {
  const { rootNode, setRootNode } = useContext(NoteContext);
  const currentId = useRef(1);

  return {
    createId: () => {
      return (currentId.current++).toString();
    },
    addNode: (node: INode) => {
      if (!rootNode) return;

      const newRootNode = {
        ...rootNode,
        children: [...rootNode.children, node],
      };

      setRootNode(newRootNode);
    },
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
