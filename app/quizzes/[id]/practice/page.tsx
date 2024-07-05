"use client";

import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { QuizType } from "@/models/Quiz";
import LoadingPage from "@/components/loadingPage";
import PracticeContext from "@/app/quizzes/[id]/practice/context/PracticeContext";
import Question from "@/app/quizzes/[id]/practice/components/Question";
import { useRouter } from "next/navigation";
import NotFound from "@/components/notFound";

export default function Practice({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    async function fetchQuiz() {
      const response = await fetch(`/api/quizzes/${params.id}`, {
        cache: "no-cache"
      });
      if (response.status === 404)
        return setNotFound(true);
      if (response.status === 401)
        return router.push("/dashboard?unauthorized");
      if (!response.ok)
        return router.push("/dashboard?error");

      const data = await response.json();

      setQuiz(data);
    }

    fetchQuiz()
      .then(() => setLoading(false));
  }, []);

  if (notFound) return <NotFound />;
  if (loading || !quiz) return <LoadingPage />;

  return (
    <PracticeContext.Provider value={{ quiz }}>
      <section>
        <div className="mb-16">
          <PageBreadcrumbs
            back={`/quizzes/${quiz._id}`}
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
