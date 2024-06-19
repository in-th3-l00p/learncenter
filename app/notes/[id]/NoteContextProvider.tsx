"use client";

import React from "react";

import { INote } from "@/models/Note";
import NoteContext from "@/app/notes/[id]/NoteContext";

export default function NoteContextProvider({
  note,
  children,
}: {
  note: string;
  children: React.ReactNode;
}) {

  return (
    <NoteContext.Provider value={{ note: JSON.parse(note) }}>
      {children}
    </NoteContext.Provider>
  );
}
