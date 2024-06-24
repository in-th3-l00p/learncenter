import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { useContext } from "react";

import { DropdownSelector } from "@/app/quizzes/new/components/dropdownSelector";
import NewQuizContext from "@/app/quizzes/new/context/NewQuizContext";

function DesktopOptionSelector() {
  const {
    quiz,
    setQuiz,
    selectedQuestionIndex,
    selectedOptionIndex,
    setSelectedOptionIndex,
  } = useContext(NewQuizContext);

  return (
    <div
      className={"hidden sm:block rounded-2xl border-small border-content1 p-2"}
    >
      <Listbox
        aria-label={"Options"}
        topContent={
          <Button
            className={"w-full mb-2"}
            title={"Add option"}
            onClick={() => {
              const newQuestions = [...quiz.questions];

              newQuestions[selectedQuestionIndex].options.push({
                option: "",
                isCorrect: false,
              });

              setQuiz({ ...quiz, questions: newQuestions });
            }}
          >
            <span className="text-lg">+</span>
          </Button>
        }
      >
        {quiz.questions[selectedQuestionIndex].options.map((option, index) => (
          <ListboxItem
            key={index}
            className={selectedOptionIndex === index ? "bg-content1" : ""}
            onClick={() => setSelectedOptionIndex(index)}
          >
            {option.option}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}

function MobileOptionSelector() {
  const {
    quiz,
    selectedQuestionIndex,
    selectedOptionIndex,
    setSelectedOptionIndex,
  } = useContext(NewQuizContext);

  return (
    <DropdownSelector
      className={"sm:hidden"}
      items={quiz.questions[selectedQuestionIndex].options.map(
        (option) => option.option,
      )}
      value={selectedOptionIndex}
      onChange={setSelectedOptionIndex}
    />
  );
}

export function Options({}) {
  return (
    <div>
      <h3 className={"text-xl my-2"}>Options:</h3>
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <DesktopOptionSelector />
        <MobileOptionSelector />

        <div className="flex-grow flex flex-col justify-between">
          <div>
            <Input
              className={"mb-4"}
              label={"Text"}
              placeholder={"Option's text"}
              type={"text"}
            />

            <Checkbox className={"block mb-auto"}>Correct</Checkbox>
          </div>

          <div>
            <Button color={"danger"} title={"Delete option"}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
