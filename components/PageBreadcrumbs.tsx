"use client";

import { Button } from "@nextui-org/button";
import { BiArrowBack } from "react-icons/bi";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";
import { Link } from "@nextui-org/link";

export default function PageBreadcrumbs({
  back,
  path,
}: {
  back?: string;
  path: {
    title: string;
    href?: string;
  }[];
}) {
  return (
    <div className="flex items-center gap-4 mb-8">
      {back && (
        <Button isIconOnly as={Link} href={back} size={"sm"}>
          <BiArrowBack />
        </Button>
      )}

      <Breadcrumbs>
        {path.map((item, index) => (
          <BreadcrumbItem key={index} href={item.href}>
            {item.title}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}
