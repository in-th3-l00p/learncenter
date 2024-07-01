import { Button } from "@nextui-org/button";
import clsx from "clsx";
import { Link } from "@nextui-org/link";
import React from "react";

export function StartButton({ icon, iconAlt, href, children, soon }: {
  icon: string;
  iconAlt: string;
  href: string;
  children: string;
  soon?: boolean;
}) {
  if (soon)
    return (
      <Button
        className={
          "w-64 h-64 flex flex-col justify-center items-center gap-2 relative"
        }
        disabled={true}
      >
        <img alt={iconAlt} className={"w-16 h-16 invert"} src={icon} />
        {children}

        <div
          className={clsx(
            "w-full h-full absolute z-10 top-0 left-0",
            "rounded-lg bg-white dark:bg-black bg-opacity-75",
            "flex justify-center items-center",
            "text-xl font-bold"
          )}
        >
          Soon...
        </div>
      </Button>
    );

  return (
    <Button
      as={Link}
      className={"w-64 h-64 flex flex-col justify-center items-center gap-2"}
      href={href}
    >
      <img alt={iconAlt} className={"w-16 h-16 invert"} src={icon} />
      {children}
    </Button>
  );
}