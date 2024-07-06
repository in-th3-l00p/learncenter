"use client";

import "chart.js/auto";
import EntityData from "@/app/dashboard/components/data/entityData";

export default function QuizData() {
  const DUMMY_DATA = [0, 10, 20, 30, 20, 30, 50];
  const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <EntityData
      data={[
        {
          label: "Quizzes taken last week",
          value: 8
        },
        {
          label: "Quizzes created",
          value: 5
        }
      ]}
      chartTitle={"Quiz success rate"}
      chartLabel={"Success rate"}
      chartData={DUMMY_DATA}
      chartLabels={LABELS}
    />
  );
}