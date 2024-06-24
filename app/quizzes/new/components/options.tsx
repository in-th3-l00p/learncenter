import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { useContext, useEffect, useRef } from "react";
import clsx from "clsx";

import { DropdownSelector } from "@/app/quizzes/new/components/dropdownSelector";
import NewQuizContext from "@/app/quizzes/new/context/NewQuizContext";

function useCreateOption() {
  const { quiz, setQuiz, selectedQuestionIndex, setSelectedOptionIndex } =
    useContext(NewQuizContext);

  return () => {
    const newQuestions = [...quiz.questions];

    newQuestions[selectedQuestionIndex].options.push({
      option: "",
      isCorrect: false,
    });

    setQuiz({ ...quiz, questions: newQuestions });
    setSelectedOptionIndex(
      newQuestions[selectedQuestionIndex].options.length - 1,
    );
  };
}

function DesktopOptionSelector() {
  const {
    quiz,
    selectedQuestionIndex,
    selectedOptionIndex,
    setSelectedOptionIndex,
  } = useContext(NewQuizContext);
  const createOption = useCreateOption();

  const listboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listboxRef.current) {
      const selected = listboxRef.current?.querySelector(
        "#option-" + selectedOptionIndex,
      ) as HTMLLIElement | null;

      if (!selected) return;

      listboxRef.current.scrollTo({
        top:
          selected.offsetTop -
          listboxRef.current?.clientHeight / 2 +
          selected.clientHeight / 2,
        behavior: "smooth",
      });
    }
  }, [selectedOptionIndex]);

  return (
    <div
      className={"hidden sm:block rounded-2xl border-small border-content1 p-2"}
    >
      <Button
        className={"w-full mb-2"}
        title={"Add option"}
        onClick={createOption}
      >
        <span className="text-lg">+</span>
      </Button>
      <Listbox
        ref={listboxRef}
        aria-label={"Options"}
        className={"h-48 pe-2 overflow-y-scroll"}
      >
        {quiz.questions[selectedQuestionIndex].options.map((option, index) => (
          <ListboxItem
            key={index}
            className={clsx(
              "pe-4",
              selectedOptionIndex === index ? "bg-content1" : "",
            )}
            id={`option-${index}`}
            onClick={() => setSelectedOptionIndex(index)}
          >
            Option {index + 1}
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
  const createOption = useCreateOption();

  return (
    <DropdownSelector
      className={"sm:hidden"}
      items={quiz.questions[selectedQuestionIndex].options.map(
        (_, index) => `Option ${index}`,
      )}
      newOption={true}
      value={selectedOptionIndex}
      onChange={setSelectedOptionIndex}
      onNewOption={createOption}
    />
  );
}

export function Options({}) {
  const {
    quiz,
    setQuiz,
    selectedQuestionIndex,
    selectedOptionIndex,
    setSelectedOptionIndex,
  } = useContext(NewQuizContext);

  console.log(
    quiz.questions[selectedQuestionIndex].options[selectedOptionIndex]
      .isCorrect,
  );

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
              value={
                quiz.questions[selectedQuestionIndex].options[
                  selectedOptionIndex
                ].option
              }
              onChange={(e) => {
                const newQuestions = [...quiz.questions];

                newQuestions[selectedQuestionIndex].options[
                  selectedOptionIndex
                ].option = e.target.value;
                setQuiz({ ...quiz, questions: newQuestions });
              }}
            />

            <Checkbox
              className={"block mb-auto"}
              isSelected={
                quiz.questions[selectedQuestionIndex].options[
                  selectedOptionIndex
                ].isCorrect
              }
              onChange={(e) => {
                const newQuestions = [...quiz.questions];

                newQuestions[selectedQuestionIndex].options[
                  selectedOptionIndex
                ].isCorrect = e.target.checked;
                setQuiz({ ...quiz, questions: newQuestions });
              }}
            >
              Correct
            </Checkbox>
          </div>

          <div>
            <Button
              color={"danger"}
              disabled={
                quiz.questions[selectedQuestionIndex].options.length <= 1
              }
              title={"Delete option"}
              type={"button"}
              onClick={() => {
                if (
                  selectedOptionIndex ===
                  quiz.questions[selectedQuestionIndex].options.length - 1
                ) {
                  setSelectedOptionIndex(selectedOptionIndex - 1);
                }
                const newQuestions = [...quiz.questions];

                newQuestions[selectedQuestionIndex].options.splice(
                  selectedOptionIndex,
                  1,
                );

                setQuiz({ ...quiz, questions: newQuestions });
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
