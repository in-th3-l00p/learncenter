import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useContext } from "react";

import { Answers, Options } from "@/app/quizzes/new/components/options";
import { subtitle } from "@/components/primitives";
import { DropdownSelector } from "@/app/quizzes/new/components/dropdownSelector";
import { spacing } from "@/app/quizzes/new/components/primitives";
import NewQuizContext from "@/app/quizzes/new/context/NewQuizContext";
import ZodErrorParagraph from "@/components/ZodErrorParagraph";

function QuestionDisplay() {
  const { quiz, setQuiz, selectedQuestionIndex, setSelectedQuestionIndex } =
    useContext(NewQuizContext);

  return (
    <div className={"mb-8"}>
      <ZodErrorParagraph
        path={[`questions`, selectedQuestionIndex, "question"]}
      />
      <Input
        className={"mb-4"}
        label={"Question"}
        placeholder={"Question"}
        type={"text"}
        value={quiz.questions[selectedQuestionIndex].question}
        onChange={(e) => {
          const updatedQuestions = [...quiz.questions];

          updatedQuestions[selectedQuestionIndex].question = e.target.value;
          setQuiz({ ...quiz, questions: updatedQuestions });
        }}
      />

      <ZodErrorParagraph
        path={[`questions`, selectedQuestionIndex, "description"]}
      />
      <Textarea
        className={"mb-4"}
        label={"Description"}
        placeholder={"Description"}
        type={"text"}
        value={quiz.questions[selectedQuestionIndex].description}
        onChange={(e) => {
          const updatedQuestions = [...quiz.questions];

          updatedQuestions[selectedQuestionIndex].description = e.target.value;
          setQuiz({ ...quiz, questions: updatedQuestions });
        }}
      />

      <Button
        color={"danger"}
        disabled={quiz.questions.length <= 1}
        type={"button"}
        onClick={() => {
          if (selectedQuestionIndex === quiz.questions.length - 1) {
            setSelectedQuestionIndex(selectedQuestionIndex - 1);
          }

          const updatedQuestions = [...quiz.questions];

          updatedQuestions.splice(selectedQuestionIndex, 1);
          setQuiz({ ...quiz, questions: updatedQuestions });
        }}
      >
        Delete
      </Button>
    </div>
  );
}

export function Questions() {
  const {
    quiz,
    setQuiz,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    setSelectedOptionIndex,
  } = useContext(NewQuizContext);

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Enter the quiz questions:</h2>

      <DropdownSelector
        className={"mb-4"}
        items={quiz.questions.map((_, i) => `Question ${i + 1}`)}
        newOption={true}
        value={selectedQuestionIndex}
        onChange={(index) => {
          setSelectedOptionIndex(0);
          setSelectedQuestionIndex(index);
        }}
        onNewOption={() => {
          const updatedQuestions = [...quiz.questions];

          updatedQuestions.push({
            question: ``,
            description: "",
            options: [
              {
                option: "",
                isCorrect: false,
              },
            ],
          });

          setQuiz({ ...quiz, questions: updatedQuestions });
          setSelectedOptionIndex(0);
          setSelectedQuestionIndex(updatedQuestions.length - 1);
        }}
      />

      <QuestionDisplay />
      <Options />
      <Answers />
    </div>
  );
}
