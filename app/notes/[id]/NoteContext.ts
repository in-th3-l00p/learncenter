"use client";

import { createContext } from "react";

import { INote } from "@/models/Note";

interface INoteContext {
  note: INote;
}

const NoteContext = createContext<INoteContext>({} as INoteContext);

export default NoteContext;
