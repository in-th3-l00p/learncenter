import { createContext } from "react";

export interface IEditorContext {
  nodeAdded: boolean;
  setNodeAdded: (nodeAdded: boolean) => void;
}

const EditorContext = createContext<IEditorContext>({} as IEditorContext);

export default EditorContext;
