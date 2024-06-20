import { getServerSession } from "next-auth";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import { subtitle, title } from "@/components/primitives";
import Note, { INote } from "@/models/Note";
import Node from "@/models/Node";
import { List, ListCard } from "@/app/dashboard/list";

export default async function Dashboard() {
  async function create() {
    "use server";

    const session = await getServerSession(authOptions);

    if (!session) return;

    const rootNode = await Node.create({
      type: "div",
      parent: null,
      attributes: [],
      children: [],
    });

    const note = await Note.create({
      title: `Note #${(await Note.countDocuments()) + 1}`,
      content: "",
      users: [
        {
          userId: session?.user.id,
        },
      ],
      rootNode: rootNode._id,
    });

    return redirect(`/notes/${note._id}`);
  }

  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  const notes = (
    await Note.find({ "users.userId": user._id }).sort({
      createdAt: "asc",
    })
  ).reverse();

  return (
    <section>
      <div className="mb-8">
        <h1 className={title()}>Dashboard</h1>
        <h2 className={subtitle()}>Welcome, {user.name}</h2>
      </div>

      <div>
        <form
          action={create}
          className={"w-full flex gap-8 justify-between mb-4"}
        >
          <h2 className={"text-3xl self-end"}>Notes</h2>
          <Button isIconOnly type={"submit"}>
            <span className={"text-2xl"}>+</span>
          </Button>
        </form>

        <List>
          {notes.map((note: INote, index) => (
            <ListCard
              key={index}
              description={""}
              href={`/notes/${note._id}`}
              title={note.title}
            />
          ))}

          <form action={create}>
            <Card
              as={Button}
              className={"w-[300px] min-w-[300px] h-48"}
              type={"submit"}
            >
              <CardBody className={"flex justify-center items-center"}>
                <h3 className={"text-3xl"}>+</h3>
              </CardBody>
            </Card>
          </form>
        </List>
      </div>
    </section>
  );
}
