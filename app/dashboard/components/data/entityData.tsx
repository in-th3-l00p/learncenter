"use client";

import clsx from "clsx";
import { subtitle } from "@/components/primitives";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

export default function EntityData({ data, chartTitle, chartLabel, chartData, chartLabels }: {
  data: {
    label: string;
    value: number;
  }[];
  chartTitle: string;
  chartLabel: string;
  chartData: number[];
  chartLabels: string[];
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current!, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: chartLabel,
            data: chartData,
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
    <div className={clsx(
      "max-w-[500px] w-full",
      "flex flex-col justify-center items-center",
      "text-center mb-16"
    )}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 mb-16">
        {data.map(({ label, value }, index) => (
          <div key={index} className={clsx(
            "max-w-fit mx-auto",
            (data.length % 2 === 1 && index === data.length - 1 ? "sm:col-span-2" : "")
          )}>
            <h2 className={"text-8xl"}>{value}</h2>
            <p className={"break-words mx-auto"}>{label}</p>
          </div>
        ))}
      </div>

      <h2 className={clsx(subtitle(), "text-center")}>{chartTitle}</h2>
      <div className="w-full invert dark:invert-0">
        <canvas className={"bg-black"} ref={chartRef} />
      </div>
    </div>
  );
}
