import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useContext } from "react";

import { Answers, Options } from "@/app/quizzes/components/options";
import { subtitle } from "@/components/primitives";
import { DropdownSelector } from "@/components/NewForm/dropdownSelector";
import { spacing } from "@/components/NewForm/primitives";
import QuizContext, {
  IQuizContext,
  NewQuizType,
} from "@/app/quizzes/context/QuizContext";
import QuizZodErrorParagraph from "@/app/quizzes/components/QuizZodErrorParagraph";

function QuestionDisplay() {
  const { quiz, setQuiz, selectedQuestionIndex, setSelectedQuestionIndex } =
    useContext(QuizContext) as IQuizContext & {
      quiz: NewQuizType;
      setQuiz: (quiz: NewQuizType) => void;
    };

  return (
    <div className={"mb-8"}>
      <QuizZodErrorParagraph
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

      <QuizZodErrorParagraph
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
  } = useContext(QuizContext) as IQuizContext & {
    quiz: NewQuizType;
    setQuiz: (quiz: NewQuizType) => void;
  };

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Enter the quiz questions:</h2>

      <DropdownSelector
        className={"mb-4"}
        items={quiz.questions.map((_, i) => `Question ${i + 1}`)}
        newOption={true}
        selected={selectedQuestionIndex}
        setSelected={(index) => setSelectedQuestionIndex(index)}
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
