"use client";

import { useEffect, useRef } from "react";
import "chart.js/auto";
import { Chart } from "chart.js";
import { subtitle } from "@/components/primitives";
import clsx from "clsx";

export default function QuizChart() {
  const DUMMY_DATA = [0, 10, 20, 30, 20, 30, 50];
  const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current!, {
      type: "line",
      data: {
        labels: LABELS,
        datasets: [
          {
            label: "Quiz scores",
            data: DUMMY_DATA,
            borderColor: "white",
            backgroundColor: "black"
          }
        ]
      }
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className={"max-w-[500px] w-full flex flex-col justify-center items-center"}>
      <h2 className={clsx(subtitle(), "text-center")}>Latest quiz scores:</h2>
      <canvas ref={chartRef} />
    </div>
  );
}