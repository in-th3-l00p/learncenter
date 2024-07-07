"use client";

import React, { useContext, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import clsx from "clsx";

import { subtitle, title } from "@/components/primitives";
import NoteContext from "@/app/notes/[id]/context/NoteContext";
import { IUser } from "@/models/User";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import Editor from "@/app/notes/[id]/components/editor";
import { NoteButtons } from "@/app/notes/[id]/components/noteButtons/noteButtons";
import { useSession } from "next-auth/react";
import LoadingPage from "@/components/loadingPage";

function OwnerName({ currentUser }: {
  currentUser: IUser
}) {
  const { note } = useContext(NoteContext);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (note.users[0].userId.toString() !== user?._id.toString()) {
      fetch("/api/users/" + note.users[0].userId)
        .then((resp) => resp.json())
        .then(setUser);
      return;
    }

    setUser(currentUser);
  }, [note]);

  if (currentUser === null)
    return <Skeleton className={"w-32 h-6 rounded-md"} />;

  return <span>{currentUser.name}</span>;
}

export default function NoteEditor() {
  const { note } = useContext(NoteContext);
  const session = useSession();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (session.status === "loading")
      return;
    fetch("/api/users/" + session.data?.user.id)
      .then((resp) => resp.json())
      .then(setUser);
  }, [session]);

  if (user === null)
    return <LoadingPage />
  return (
    <section>
      <div className={"mb-8 pb-4 border-b"}>
        <PageBreadcrumbs
          back={"/dashboard#notes"}
          path={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Notes", href: "/dashboard#notes" },
            { title: `Note "${note.title}"` },
          ]}
        />

        <div className="flex w-full justify-between gap-4">
          <div>
            <h1 className={title()}>Note: {note.title}</h1>
            <h2 className={subtitle()}>
              Created at: {new Date(note.createdAt).toLocaleDateString()}
            </h2>
            <h2 className={clsx(subtitle(), "flex items-center gap-2")}>
              Created by:
              <OwnerName currentUser={user} />
            </h2>
          </div>

          <NoteButtons user={user} />
        </div>
      </div>

      <Editor />
    </section>
  );
}
