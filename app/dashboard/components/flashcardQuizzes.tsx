import { FlashcardQuizType } from "@/models/FlashcardQuiz";
import { redirect } from "next/navigation";
import { DashboardList } from "@/app/dashboard/components/dashboardList";

export function FlashcardQuizzes({ flashcardQuizzes }: { flashcardQuizzes: FlashcardQuizType[] }) {
  async function create() {
    "use server";

    return redirect(`/flashcard-quizzes/new`);
  }

  return (
    <DashboardList
      create={create}
      href={"/flashcard-quizzes/"}
      id={"flashcard-quizzes"}
      items={flashcardQuizzes}
      title={"Flashcard Quizzes"}
    />
  );
}