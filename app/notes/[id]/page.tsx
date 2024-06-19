"use client";

import { useContext } from "react";

import { title } from "@/components/primitives";
import NoteContext from "@/app/notes/[id]/NoteContext";

export default function NoteEditor() {
  const { note } = useContext(NoteContext);

  return (
    <section>
      <h1 className={title()}>Note: {note.title}</h1>
    </section>
  );
}
