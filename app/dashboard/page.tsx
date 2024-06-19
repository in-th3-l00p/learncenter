import { getServerSession } from "next-auth";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import { Link } from "@nextui-org/link";
import { signIn } from "next-auth/react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import { subtitle, title } from "@/components/primitives";
import Note, { INote } from "@/models/Note";

export default async function Dashboard() {
  async function create() {
    "use server";

    const session = await getServerSession(authOptions);

    if (!session) return;

    const note = await Note.create({
      title: `Note #${(await Note.countDocuments()) + 1}`,
      content: "",
      users: [
        {
          userId: session?.user.id,
        },
      ],
    });

    return redirect(`/notes/${note._id}`);
  }

  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  const notes = await Note.find({ "users.userId": user._id });

  return (
    <section>
      <div className="mb-8">
        <h1 className={title()}>Dashboard</h1>
        <h2 className={subtitle()}>Welcome, {user.name}</h2>
      </div>

      <div>
        <h2 className={subtitle()}>Notes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {notes.map((note: INote, index) => (
            <Card
              key={index}
              as={Link}
              className={"aspect-video"}
              href={`/notes/${note._id}`}
            >
              <CardHeader>
                <h3 className={"text-lg"}>{note.title}</h3>
              </CardHeader>
              <CardBody>
                <p>
                  {note.content.length > 0
                    ? note.content.substring(0, 200)
                    : "There is nothing written yet."}
                </p>
              </CardBody>
            </Card>
          ))}

          <form action={create} className={"block w-full aspect-video"}>
            <Card as={Button} className={"w-full h-full"} type={"submit"}>
              <CardBody className={"flex justify-center items-center"}>
                <h3 className={"text-3xl"}>+</h3>
              </CardBody>
            </Card>
          </form>
        </div>
      </div>
    </section>
  );
}
