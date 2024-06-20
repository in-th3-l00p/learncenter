"use client";

import React, { createContext } from "react";

import { INote } from "@/models/Note";
import { ITNode } from "@/models/Node";

interface INoteContext {
  note: INote;
  setNote: React.Dispatch<React.SetStateAction<INote>>;

  rootNode: ITNode | null;
  setRootNode: React.Dispatch<React.SetStateAction<ITNode | null>>;
}

const NoteContext = createContext<INoteContext>({} as INoteContext);

export default NoteContext;
