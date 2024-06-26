import { Select, SelectItem } from "@nextui-org/select";
import { useContext } from "react";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/app/quizzes/components/primitives";
import QuizContext from "@/app/quizzes/context/QuizContext";

export function QuizVisibility() {
  const { quiz, setQuiz } = useContext(QuizContext);

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Quiz settings:</h2>
      <Select
        defaultSelectedKeys={["public"]}
        label={"Visibility"}
        selectedKeys={[quiz.visibility]}
        selectionMode={"single"}
        onChange={(e) => {
          setQuiz({
            ...quiz,
            visibility: e.target.value as "public" | "private",
          });
        }}
      >
        <SelectItem key={"public"}>Public</SelectItem>
        <SelectItem key={"private"}>Private</SelectItem>
      </Select>
    </div>
  );
}
