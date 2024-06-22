"use client";

import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import clsx from "clsx";

import { subtitle, title } from "@/components/primitives";
import NoteContext from "@/app/notes/[id]/context/NoteContext";
import Editor from "@/app/notes/[id]/components/Editor";
import { INote } from "@/models/Note";
import { IUser } from "@/models/User";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

function OwnerName() {
  const { note } = useContext(NoteContext);
  const [user, setUser] = useState<IUser | null>(null);

  function getNoteOwner(note: INote) {
    return note.users[0].userId;
  }

  useEffect(() => {
    fetch("/api/users/" + getNoteOwner(note))
      .then((resp) => resp.json())
      .then(setUser);
  }, [note]);

  if (user === null) return <Skeleton className={"w-32 h-6 rounded-md"} />;

  return <span>{user.name}</span>;
}

export default function NoteEditor() {
  const { note } = useContext(NoteContext);

  return (
    <section>
      <div className={"mb-8 pb-4 border-b"}>
        <PageBreadcrumbs
          back={"/dashboard"}
          path={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Notes", href: "/dashboard#notes" },
            { title: `Note "${note.title}"` },
          ]}
        />

        <h1 className={title()}>Note: {note.title}</h1>
        <h2 className={subtitle()}>
          Created at: {new Date(note.createdAt).toLocaleDateString()}
        </h2>
        <h2 className={clsx(subtitle(), "flex items-center gap-2")}>
          Created by:
          <OwnerName />
        </h2>
      </div>

      <Editor />
    </section>
  );
}
