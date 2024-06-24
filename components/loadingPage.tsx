"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";

export default function LoadingPage() {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") {
          return "Loading";
        }

        return prev + ".";
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={"w-full h-full flex justify-center items-center"}>
      <Spinner color={"white"} label={loadingText} size={"lg"} />
    </div>
  );
}