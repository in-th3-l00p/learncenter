import Image from "next/image";
import { getServerSession } from "next-auth";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { signIn } from "next-auth/react";

import User, { IUser } from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SubscriptionDisplay } from "@/app/profile/subscriptionDisplay";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/api/auth/signin");

  const user = await User.findById(session?.user?.id);

  if (!user) return redirect("/api/auth/signin");

  return (
    <section className={"flex flex-col gap-8"}>
      <Card>
        <CardBody className="flex flex-row flex-wrap gap-8">
          <Image
            alt={"profile"}
            className={"rounded-full"}
            height={100}
            src={user.image || ""}
            width={100}
          />

          <div>
            <h2 className={"text-2xl font-bold"}>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className={"text-xl"}>Subscription</h2>
        </CardHeader>

        <CardBody>
          <SubscriptionDisplay user={user as IUser} />
        </CardBody>
      </Card>
    </section>
  );
}
