"use client";

import React, { useState } from "react";

import NoteContext from "@/app/notes/[id]/context/NoteContext";
import { INode } from "@/models/Node";

export default function NoteContextProvider({
  note,
  children,
}: {
  note: string;
  children: React.ReactNode;
}) {
  const [statefulNote, setStatefulNote] = useState(JSON.parse(note));
  const [rootNode, setRootNode] = useState<INode | null>({
    _id: "0",
    type: "div",
    children: [],
    attributes: [],
  });

  return (
    <NoteContext.Provider
      value={{
        note: statefulNote,
        setNote: setStatefulNote,
        rootNode,
        setRootNode,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
