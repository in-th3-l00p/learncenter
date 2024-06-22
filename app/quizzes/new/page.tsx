"use client";

import { Button } from "@nextui-org/button";

import { title } from "@/components/primitives";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { QuizInformationInput } from "@/app/quizzes/new/quizInformationInput";
import { Questions } from "@/app/quizzes/new/questions";
import { QuizVisibility } from "@/app/quizzes/new/quizVisibility";

export default function NewQuiz() {
  return (
    <section>
      <div className={"mb-16"}>
        <PageBreadcrumbs
          back={"/dashboard"}
          path={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Quizzes", href: "/dashboard#quizzes" },
            { title: "New quiz" },
          ]}
        />
        <h1 className={title()}>Create a new quiz</h1>
      </div>

      <div className={"max-w-[800px] mx-auto"}>
        <QuizInformationInput />
        <Questions />
        <QuizVisibility />

        <Button className={"block mx-auto mb-16"}>Create</Button>
      </div>
    </section>
  );
}
