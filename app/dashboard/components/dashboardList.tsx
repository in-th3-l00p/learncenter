import { Button } from "@nextui-org/button";
import { List, ListCard } from "@/app/dashboard/components/list";
import { Card, CardBody } from "@nextui-org/card";

export function DashboardList({ title, items, href, create, id }: {
  title: string;
  items: any[];
  href: string;
  create: () => Promise<any>;
  id: string;
}) {
  return (
    <div className={"mb-16"} id={id}>
      <form
        action={create}
        className={"w-full flex gap-8 justify-between mb-4"}
      >
        <h2 className={"text-3xl self-end"}>{title}</h2>
        <Button isIconOnly type={"submit"}>
          <span className={"text-2xl"}>+</span>
        </Button>
      </form>

      <List>
        {items.map((item: any, index) => (
          <ListCard
            key={index}
            description={item.description || ""}
            href={href + item._id}
            title={item.title}
          />
        ))}

        <form action={create}>
          <Card
            as={Button}
            className={"w-[300px] min-w-[300px] h-48"}
            type={"submit"}
          >
            <CardBody className={"flex justify-center items-center"}>
              <h3 className={"text-3xl"}>+</h3>
            </CardBody>
          </Card>
        </form>
      </List>
    </div>
  );
}