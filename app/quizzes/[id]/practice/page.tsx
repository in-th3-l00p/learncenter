"use client";

import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { QuizType } from "@/models/Quiz";
import LoadingPage from "@/components/loadingPage";
import PracticeContext from "@/app/api/quizzes/[id]/context/PracticeContext";
import Question from "@/app/api/quizzes/[id]/components/Question";

export default function Practice({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchQuiz() {
      const response = await fetch(`/api/quizzes/${params.id}`);
      const data = await response.json();

      setQuiz(data);
    }

    fetchQuiz().then(() => setLoading(false));
  }, []);

  if (loading || !quiz) return <LoadingPage />;

  return (
    <PracticeContext.Provider value={{ quiz }}>
      <section>
        <div className="mb-16">
          <PageBreadcrumbs
            back={"/dashboard"}
            path={[
              { title: "Dashboard", href: "/dashboard" },
              { title: "Quizzes", href: "/dashboard#quizzes" },
              { title: `Quiz: "${quiz.title}"`, href: `/quizzes/${quiz._id}` },
              { title: "Practice" },
            ]}
          />
          <h1 className={title()}>Practice</h1>
        </div>
      </section>

      <Question />
    </PracticeContext.Provider>
  );
}
