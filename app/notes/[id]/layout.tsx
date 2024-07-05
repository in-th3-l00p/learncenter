import React from "react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import Note from "@/models/Note";
import User from "@/models/User";
import NoteContextProvider from "@/app/notes/[id]/context/NoteContextProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

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

    if (!note || !note.users[0].userId.equals(user._id)) {
      return redirect("/dashboard?unauthorized");
    }
  } catch (e) {
    notFound();
  }

  return (
    <NoteContextProvider note={JSON.stringify(note)}>
      {children}
    </NoteContextProvider>
  );
}
