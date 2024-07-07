import React from "react";
import UpdateButton from "@/app/notes/[id]/components/noteButtons/updateButton";
import GenerationButton from "@/app/notes/[id]/components/noteButtons/generationButton";
import { IUser } from "@/models/User";

export function NoteButtons({ user }: {
  user: IUser
}) {
  return (
    <div className={"flex flex-col gap-4"}>
      <UpdateButton />
      {user.subscriptionId && <GenerationButton />}
    </div>
  );
}