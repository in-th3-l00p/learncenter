import { getServerSession } from "next-auth";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";

import User from "@/models/User";
import { subtitle, title } from "@/components/primitives";
import { List, ListCard } from "@/app/dashboard/list";
import Quiz from "@/models/Quiz";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

function DashboardList({
  title,
  items,
  href,
  create,
  id,
}: {
  title: string;
  items: any[];
  href: string;
  create: () => Promise<any>;
  id: string;
}) {
  return (
    <div className={"mb-16"} id={id}>
      <form
        action={create}
        className={"w-full flex gap-8 justify-between mb-4"}
      >
        <h2 className={"text-3xl self-end"}>{title}</h2>
        <Button isIconOnly type={"submit"}>
          <span className={"text-2xl"}>+</span>
        </Button>
      </form>

      <List>
        {items.map((item: any, index) => (
          <ListCard
            key={index}
            description={item.description || ""}
            href={href + item._id}
            title={item.title}
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
  );
}

function Quizzes({ quizzes }: { quizzes: any[] }) {
  async function create() {
    "use server";

    return redirect(`/quizzes/new`);
  }

  return (
    <DashboardList
      create={create}
      href={"/quizzes/"}
      id={"quizzes"}
      items={quizzes}
      title={"Quizzes"}
    />
  );
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  const quizzes = (
    await Quiz.find({ owner: user._id }).sort({
      createdAt: "asc",
    })
  ).reverse();

  return (
    <section>
      <div className="mb-16">
        <h1 className={title()}>Dashboard</h1>
        <h2 className={subtitle()}>Welcome, {user.name}</h2>
      </div>

      <Quizzes quizzes={quizzes} />
    </section>
  );
}
