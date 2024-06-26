"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { tv } from "tailwind-variants";
import clsx from "clsx";

const list = tv({
  base: clsx("flex gap-8 overflow-x-scroll", "bg-content2 p-8 rounded-2xl"),
});

const listCard = tv({
  base: "w-[300px] min-w-[300px] h-48",
});

const listCardTitle = tv({
  base: "text-lg",
});

export function List({ children }: { children: React.ReactNode }) {
  return <div className={list()}>{children}</div>;
}

export function ListCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card as={Link} className={listCard()} href={href}>
      <CardHeader>
        <h3 className={listCardTitle()}>{title}</h3>
      </CardHeader>
      <CardBody>
        <p>
          {description.length > 0
            ? description
            : "There is nothing written yet."}
        </p>
      </CardBody>
    </Card>
  );
}
