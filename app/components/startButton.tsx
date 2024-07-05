import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import React from "react";

export function StartButton({ icon, iconAlt, href, children }: {
  icon: string;
  iconAlt: string;
  href: string;
  children: string;
}) {
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