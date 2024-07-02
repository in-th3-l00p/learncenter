"use client";

import React, { useEffect, useState } from "react";

import NoteContext from "@/app/notes/[id]/context/NoteContext";

export default function NoteContextProvider({
  note,
  children,
}: {
  note: string;
  children: React.ReactNode;
}) {
  const [statefulNote, setStatefulNote] = useState(JSON.parse(note));

  useEffect(() => {
    fetch(`/api/notes/${statefulNote._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statefulNote),
    })
      .then(r => {
        if (!r.ok) {
          throw new Error("Failed to save note");
        }
      })
      .catch(e => {
        // todo implement something to show as an error
        console.error(e);
      });
  }, [statefulNote]);

  return (
    <NoteContext.Provider
      value={{
        note: statefulNote,
        setNote: setStatefulNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
