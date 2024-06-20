import { ToolboxState } from "@/app/notes/[id]/context/EditorContext";
import { Attribute, INode } from "@/models/Node";

export function getAttributesFromToolboxState(
  toolboxState: ToolboxState,
): Attribute[] {
  const attributes: Attribute[] = [];

  if (toolboxState.bold) attributes.push({ key: "bold", value: "true" });
  if (toolboxState.italic) attributes.push({ key: "italic", value: "true" });
  if (toolboxState.underline)
    attributes.push({ key: "underline", value: "true" });

  return attributes;
}

export function getToolboxStateFromAttributes(
  attributes: Attribute[],
): ToolboxState {
  const toolboxState: ToolboxState = {
    bold: false,
    italic: false,
    underline: false,
  };

  for (const attribute of attributes) {
    if (attribute.key === "bold") toolboxState.bold = true;
    if (attribute.key === "italic") toolboxState.italic = true;
    if (attribute.key === "underline") toolboxState.underline = true;
  }

  return toolboxState;
}

export function compareToolboxStates(
  toolboxStateA: ToolboxState,
  toolboxStateB: ToolboxState,
): boolean {
  return (
    toolboxStateA.bold === toolboxStateB.bold &&
    toolboxStateA.italic === toolboxStateB.italic &&
    toolboxStateA.underline === toolboxStateB.underline
  );
}

export function isNodeMergeValid(nodeA: INode, nodeB: INode): boolean {
  return compareToolboxStates(
    getToolboxStateFromAttributes(nodeA.attributes),
    getToolboxStateFromAttributes(nodeB.attributes),
  );
}
