import { Select, SelectItem } from "@nextui-org/select";
import React, { useContext } from "react";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/components/NewForm/primitives";

export function FlashcardQuizVisibility<T>({ context }: {
  context: React.Context<T>;
}) {
  const { flashcardQuiz, setFlashcardQuiz } = useContext(context) as {
    flashcardQuiz: {
      visibility: "public" | "private";
    };
    setFlashcardQuiz: React.Dispatch<React.SetStateAction<{
      visibility: "public" | "private";
    }>>;
  };

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
