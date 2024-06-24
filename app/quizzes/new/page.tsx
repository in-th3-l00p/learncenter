"use client";

import { Button } from "@nextui-org/button";

import { title } from "@/components/primitives";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { QuizInformationInput } from "@/app/quizzes/new/components/quizInformationInput";
import { Questions } from "@/app/quizzes/new/components/questions";
import { QuizVisibility } from "@/app/quizzes/new/components/quizVisibility";
import NewQuizContext, {
  NewQuizType,
} from "@/app/quizzes/new/context/NewQuizContext";
import useLocalStorageState from "@/hooks/useLocalStorageState";

export default function NewQuiz() {
  const [quiz, setQuiz] = useLocalStorageState<NewQuizType>("new-quiz", {
    title: "",
    description: "",
    questions: [
      {
        question: "Question 1",
        description: "",
        options: [
          {
            option: "Option 1",
            isCorrect: false,
          },
        ],
      },
    ],
    visibility: "public",
  });
  const [selectedQuestionIndex, setSelectedQuestionIndex] =
    useLocalStorageState<number>("selected-question-index", 0);
  const [selectedOptionIndex, setSelectedOptionIndex] =
    useLocalStorageState<number>("selected-option-index", 0);

  return (
    <NewQuizContext.Provider
      value={{
        quiz,
        setQuiz,
        selectedQuestionIndex,
        setSelectedQuestionIndex,
        selectedOptionIndex,
        setSelectedOptionIndex,
      }}
    >
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

          <Button className={"block mx-auto mb-8"}>Create</Button>
        </div>
      </section>
    </NewQuizContext.Provider>
  );
}
