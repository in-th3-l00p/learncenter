"use client";

import React, { createContext } from "react";

import { INote } from "@/models/Note";

interface INoteContext {
  note: INote;
  setNote: React.Dispatch<React.SetStateAction<INote>>;
}

const NoteContext = createContext<INoteContext>({} as INoteContext);

export default NoteContext;
