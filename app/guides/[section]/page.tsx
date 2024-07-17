import { subtitle, title } from "@/components/primitives";
import strapi from "@/lib/strapi";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { GuideSection } from "@/app/guides/page";
import { clsx } from "clsx";
import { notFound } from "next/navigation";
import Sidebar from "@/app/guides/components/Sidebar";

export default async function GuidePage({ params }: {
  params: { section: string; }
}) {
  const guideSections = await strapi.find<GuideSection[]>("guide-sections", {
    populate: "guides"
  });
  const guideSection = await strapi.find<GuideSection[]>("guide-sections", {
    filters: {
      slug: {
      "$eq": params.section
      }
    },
    populate: "guides"
  });

  if (guideSection.data.length === 0)
    return notFound();

  return (
    <section className={"flex-grow mb-32 flex gap-16"}>
      <Sidebar guideSections={guideSections.data} />
      <div className={"w-full"}>
        <div className={"mb-16"}>
          <h1 className={title()}>{guideSection.data[0].attributes.name}</h1>
          <h2 className={subtitle()}>{guideSection.data[0].attributes.description}</h2>
        </div>

        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
          {guideSection.data[0].attributes.guides.data.map(guide => (
            <Card
              key={guide.id}
              as={Link}
              href={`/guides/${params.section}/${guide.attributes.slug}`}
            >
              <CardHeader>
                <h2 className={subtitle()}>
                  {guide.attributes.title}
                </h2>
              </CardHeader>
              <CardBody>
                <p>{guide.attributes.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {guideSection.data[0].attributes.guides.data.length === 0 && (
          <div className="w-full">
            <h2 className={clsx(subtitle(), "text-center")}>There are no guides on this section.</h2>
          </div>
        )}
      </div>
    </section>
  )
}
