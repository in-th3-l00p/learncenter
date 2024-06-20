"use client";

import React, { createContext } from "react";

import { INote } from "@/models/Note";
import { INode } from "@/models/Node";

interface INoteContext {
  note: INote;
  setNote: React.Dispatch<React.SetStateAction<INote>>;

  rootNode: INode | null;
  setRootNode: React.Dispatch<React.SetStateAction<INode | null>>;
}

const NoteContext = createContext<INoteContext>({} as INoteContext);

export default NoteContext;
