import { redirect } from "next/navigation";
import { DashboardList } from "@/app/dashboard/components/dashboardList";

export function Quizzes({ quizzes }: { quizzes: any[] }) {
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