import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Note, { INote } from "@/models/Note";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import NoteContextProvider from "@/app/notes/[id]/context/NoteContextProvider";

function isUserAllowed(note: INote, userId: string) {
  for (const user of note.users) {
    if (user.userId === userId) {
      return true;
    }
  }

  return false;
}

export default async function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  let user, note;

  try {
    const session = await getServerSession(authOptions);

    if (!session) return redirect("/api/signin");

    user = await User.findById(session?.user?.id);

    if (!user) return redirect("/api/signin");

    note = await Note.findById(params.id);

    if (!note || isUserAllowed(note, user._id.toString())) {
      return redirect("/dashboard");
    }
  } catch (e) {
    return redirect("/dashboard");
  }

  return (
    <NoteContextProvider note={JSON.stringify(note)}>
      {children}
    </NoteContextProvider>
  );
}
