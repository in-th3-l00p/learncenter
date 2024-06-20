import { createContext } from "react";

export interface ToolboxState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface IEditorContext {
  nodeAdded: boolean;
  setNodeAdded: (nodeAdded: boolean) => void;

  toolboxState: ToolboxState;
  setToolboxState: (toolboxState: ToolboxState) => void;
}

const EditorContext = createContext<IEditorContext>({} as IEditorContext);

export default EditorContext;
