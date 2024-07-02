"use client";

import { useEffect, useState } from "react";
import LoadingPage from "@/components/loadingPage";
import PracticeContext from "@/app/flashcard-quizzes/[id]/practice/context/PracticeContext";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { title } from "@/components/primitives";
import { FlashcardQuizType } from "@/models/FlashcardQuiz";
import Flashcard from "@/app/flashcard-quizzes/[id]/practice/components/Flashcard";

export default async function Practice({ params }: {
  params: { id: string }
}) {
  const [flashcardQuiz, setFlashcardQuiz] = useState<FlashcardQuizType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFlashcardQuiz() {
      const response = await fetch(`/api/flashcard-quizzes/${params.id}`, {
        cache: "no-cache"
      });
      const data = await response.json();

      setFlashcardQuiz(data);
    }

    fetchFlashcardQuiz().then(() => setLoading(false));
  }, []);

  if (loading || !flashcardQuiz) return <LoadingPage />;

  return (
    <PracticeContext.Provider value={{ flashcardQuiz }}>
      <section>
        <div className="mb-16">
          <PageBreadcrumbs
            back={`/flashcard-quizzes/${flashcardQuiz._id}`}
            path={[
              { title: "Dashboard", href: "/dashboard" },
              { title: "Flashcard quizzes", href: "/dashboard#flashcard-quizzes" },
              {
                title: `Flashcard quiz: "${flashcardQuiz.title}"`,
                href: `/flashcard-quizzes/${flashcardQuiz._id}`
              },
              { title: "Practice" },
            ]}
          />
          <h1 className={title()}>Practice</h1>
        </div>
      </section>

      <Flashcard />
    </PracticeContext.Provider>
  );
}