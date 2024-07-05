import Note, { INote } from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { DashboardList } from "@/app/dashboard/components/dashboardList";
import { convert } from "html-to-text";

export function Notes({ notes }: { notes: INote[] }) {
  async function create() {
    "use server";

    const session = await getServerSession(authOptions);

    if (!session) return;

    const note = await Note.create({
      title: `Note #${(await Note.countDocuments()) + 1}`,
      content: "",
      users: [
        {
          userId: session?.user.id
        }
      ]
    });

    return redirect(`/notes/${note._id}`);
  }

  return (
    <DashboardList
      create={create}
      href={"/notes/"}
      id={"notes"}
      items={notes.map((note: any) => ({
        ...note._doc,
        description: convert(note.content).substring(0, 100)
      }))}
      title={"Notes"}
    />
  );
}