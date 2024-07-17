import { subtitle, title } from "@/components/primitives";
import strapi from "@/lib/strapi";
import { Guide, GuideSection } from "@/app/guides/page";
import { notFound } from "next/navigation";
import Sidebar from "@/app/guides/components/Sidebar";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import "./style.css";

export default async function GuidePage({ params }: {
  params: {
    section: string;
    guide: string;
  }
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
  const guide = await strapi.find<Guide[]>("guides", {
    filters: {
      slug: {
        "$eq": params.guide
      }
    },
    populate: "content"
  })

  if (guideSection.data.length === 0 || guide.data.length === 0)
    return notFound();

  return (
    <section className={"flex-grow mb-32 flex gap-16"}>
      <Sidebar guideSections={guideSections.data} />
      <div>
        <div className={"mb-16"}>
          <h1 className={title()}>{guide.data[0].attributes.title}</h1>
          <h2 className={subtitle()}>{guide.data[0].attributes.description}</h2>
        </div>

        <div className="content">
          <BlocksRenderer
            content={guide.data[0].attributes.content!}
          />
        </div>
      </div>
    </section>
  )
}
