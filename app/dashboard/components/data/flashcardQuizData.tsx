"use client";

import "chart.js/auto";
import EntityData from "@/app/dashboard/components/data/entityData";

export default function FlashcardQuizData() {
  const DUMMY_DATA = [0, 10, 20, 30, 20, 30, 50];
  const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <EntityData
      data={[
        {
          label: "Flashcards passed last week",
          value: 8
        }
      ]}
      chartTitle={"Latest flashcard scores"}
      chartLabel={"Score"}
      chartData={DUMMY_DATA}
      chartLabels={LABELS}
    />
  );
}