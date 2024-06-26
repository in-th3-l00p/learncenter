import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { subtitle, title } from "@/components/primitives";
import { InformationForm } from "@/app/quizzes/[id]/components/informationForm";

export default async function QuizDisplay({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  const quiz = await Quiz.findById(params.id);

  if (!quiz.owner.equals(user._id)) return redirect(`/quizzes?unauthorized`);

  quiz._id = quiz._id.toString();

  return (
    <section>
      <div className={"mb-16"}>
        <PageBreadcrumbs
          back={"/dashboard"}
          path={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Quizzes", href: "/dashboard#quizzes" },
            { title: `Quiz: "${quiz.title}"` },
          ]}
        />
        <h1 className={title()}>Quiz: {`"${quiz.title}"`}</h1>
        <h2 className={subtitle()}>
          Created at: {new Date(quiz.createdAt).toLocaleDateString()}
        </h2>
        {quiz.description && (
          <h2 className={subtitle()}>Description: {quiz.description}</h2>
        )}
      </div>

      <div className={"mb-16"}>
        <h2 className={subtitle()}>Start learning</h2>

        <div className={"flex justify-around"}>
          <Button as={Link} href={`/quizzes/${quiz._id}/practice`}>
            Practice
          </Button>
          <Button type={"button"}>Test your knowledge</Button>
        </div>
      </div>

      <InformationForm quiz={quiz} />
    </section>
  );
}
