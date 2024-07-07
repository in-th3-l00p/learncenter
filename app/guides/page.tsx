import { subtitle, title } from "@/components/primitives";
import strapi from "@/lib/strapi";
import Sidebar from "@/app/guides/components/Sidebar";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";

export type Guide = {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
  }
}

export type GuideSection = {
  id: number;
  attributes: {
    name: string;
    description: string;
    slug: string;
    guides: {
      data: Guide[];
    }
  }
}

export default async function GuidePage() {
  const guideSections = await strapi.find<GuideSection[]>("guide-sections", {
    populate: "guides"
  });

  return (
    <section className={"flex-grow mb-32 flex gap-16"}>
      <Sidebar guideSections={guideSections.data} />
      <div>
        <div className={"mb-16"}>
          <h1 className={title()}>Guides</h1>
          <h2 className={subtitle()}>Learn how to use the platform, following our guides.</h2>
        </div>

        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
          {guideSections.data.map(guideSection => (
            <Card
              key={guideSection.id}
              as={Link}
              href={`/guides/${guideSection.attributes.slug}`}
            >
              <CardHeader>
                <h2 className={subtitle()}>
                  {guideSection.attributes.name}
                </h2>
              </CardHeader>
              <CardBody>
                <p>{guideSection.attributes.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}