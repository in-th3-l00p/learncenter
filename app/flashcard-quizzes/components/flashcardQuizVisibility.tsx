import { Select, SelectItem } from "@nextui-org/select";
import { useContext } from "react";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/app/quizzes/components/primitives";
import FlashcardQuizContext from "@/app/flashcard-quizzes/context/FlashcardQuizContext";

export function FlashcardQuizVisibility() {
  const { flashcardQuiz, setFlashcardQuiz } = useContext(FlashcardQuizContext);

  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Flashcard quiz settings:</h2>
      <Select
        defaultSelectedKeys={["public"]}
        label={"Visibility"}
        selectedKeys={[flashcardQuiz.visibility]}
        selectionMode={"single"}
        onChange={(e) => {
          setFlashcardQuiz({
            ...flashcardQuiz,
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
