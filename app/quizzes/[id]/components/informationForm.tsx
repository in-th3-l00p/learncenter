import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import Quiz, { QuizType } from "@/models/Quiz";
import { subtitle } from "@/components/primitives";

export function InformationForm({ quiz }: { quiz: QuizType }) {
  async function updateQuiz(formData: FormData) {
    "use server";

    if (!formData.has("id")) return;

    const quiz = await Quiz.findById(formData.get("id") as string);

    if (!quiz) return;

    return "test";
  }

  return (
    <form action={updateQuiz} className={"mb-16"}>
      <h2 className={subtitle()}>Quiz information</h2>

      <input hidden name={"id"} type="text" value={quiz._id} />

      <div className={"max-w-[800px]"}>
        <Input
          className={"mb-4"}
          defaultValue={quiz.title}
          label={"Title"}
          placeholder={"Quiz title"}
          type={"text"}
        />

        <Textarea
          className={"mb-4"}
          defaultValue={quiz.description}
          label={"Description"}
          placeholder={"Describe your quiz"}
        />

        <Button type={"submit"}>Update quiz</Button>
      </div>
    </form>
  );
}
