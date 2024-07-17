"use client";

import { GuideSection } from "@/app/guides/page";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Link } from "@nextui-org/link";

export default function Sidebar({ guideSections }: {
  guideSections: GuideSection[];
}) {
  return (
    <aside className={"p-2 rounded-2xl border hidden sm:block min-w-fit"}>
      <Accordion isCompact>
        {guideSections.map(guideSection => (
          <AccordionItem
            key={guideSection.id}
            title={guideSection.attributes.name}
          >
            <ul className={"list-disc ps-2"}>
              {guideSection.attributes.guides.data.length === 0 && (
                <li>
                  <p className={"text-sm text-white"}>No guides available.</p>
                </li>
              )}
              {guideSection.attributes.guides.data.map(guide => (
                <li>
                  <Link
                    key={guide.id}
                    href={`/guides/${guideSection.attributes.slug}/${guide.attributes.slug}`}
                    className={"text-sm text-white hover:underline"}
                  >
                    {guide.attributes.title}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}