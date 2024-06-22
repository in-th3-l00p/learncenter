import { Select, SelectItem } from "@nextui-org/select";

import { subtitle } from "@/components/primitives";
import { spacing } from "@/app/quizzes/new/components/primitives";

export function QuizVisibility() {
  return (
    <div className={spacing()}>
      <h2 className={subtitle()}>Quiz settings:</h2>
      <Select
        defaultSelectedKeys={["public"]}
        label={"Visibility"}
        selectionMode={"single"}
      >
        <SelectItem key={"public"}>Public</SelectItem>
        <SelectItem key={"private"}>Private</SelectItem>
      </Select>
    </div>
  );
}
