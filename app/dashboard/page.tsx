import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import User from "@/models/User";
import { subtitle, title } from "@/components/primitives";
import Note from "@/models/Note";
import Quiz from "@/models/Quiz";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import FlashcardQuiz from "@/models/FlashcardQuiz";
import { Notes } from "@/app/dashboard/components/notes";
import { Quizzes } from "@/app/dashboard/components/quizzes";
import { FlashcardQuizzes } from "@/app/dashboard/components/flashcardQuizzes";
import ErrorToasts from "@/app/dashboard/components/errorToasts";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  const notes = (
    await Note.find({ "users.userId": user._id }).sort({
      createdAt: "asc",
    })
  ).reverse();

  const quizzes = (
    await Quiz.find({ owner: user._id }).sort({
      createdAt: "asc",
    })
  ).reverse();

  const flashcardQuizzes = (
    await FlashcardQuiz.find({ owner: user._id }).sort({
      createdAt: "asc",
    })
  ).reverse();

  return (
    <section>
      <div className="mb-16">
        <h1 className={title()}>Dashboard</h1>
        <h2 className={subtitle()}>Welcome, {user.name}</h2>
      </div>

      <Notes notes={notes} />
      <Quizzes quizzes={quizzes} />
      <FlashcardQuizzes flashcardQuizzes={flashcardQuizzes} />
      <ErrorToasts />
    </section>
  );
}
