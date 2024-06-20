import { getServerSession } from "next-auth";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { tv } from "tailwind-variants";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import { subtitle, title } from "@/components/primitives";
import Note, { INote } from "@/models/Note";
import Node from "@/models/Node";

const list = tv({
  base: clsx(
    "flex gap-8 overflow-x-scroll no-scrollbar",
    "bg-content2 p-8 rounded-xl",
  ),
});

const listCard = tv({
  base: "w-[300px] min-w-[300px] h-48",
});

const listCardTitle = tv({
  base: "text-lg",
});

function ListCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card as={Link} className={listCard()} href={href}>
      <CardHeader>
        <h3 className={listCardTitle()}>{title}</h3>
      </CardHeader>
      <CardBody>
        <p>
          {description.length > 0
            ? description
            : "There is nothing written yet."}
        </p>
      </CardBody>
    </Card>
  );
}

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

        <div className={list()}>
          {notes.map((note: INote, index) => (
            <ListCard
              key={index}
              description={""}
              href={`/notes/${note._id}`}
              title={note.title}
            />
          ))}

          <form action={create}>
            <Card as={Button} className={listCard()} type={"submit"}>
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
