import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { getServerSession } from "next-auth";

import { subtitle, title } from "@/components/primitives";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <section className="mb-16">
        <div
          className={
            "grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-16 mb-24"
          }
        >
          <div
            className={"text-center justify-self-center md:justify-self-start"}
          >
            <Image
              alt={"Logo"}
              className={"mx-auto mb-16 invert dark:invert-0"}
              height={200}
              src={"/logo.png"}
              width={200}
            />
            <h1 className={title()}>LearnCenter</h1>
            <h2 className={clsx(subtitle(), "mb-8")}>The best way to learn</h2>

            <div className="flex gap-4 justify-center">
              {!session && (
                <Button as={Link} href={"/api/auth/signin"}>
                  Login
                </Button>
              )}

              {session !== null && (
                <Button as={Link} href={"/dashboard"}>
                  Dashboard
                </Button>
              )}

              <Button as={Link} href={"#about"}>
                Find more
              </Button>
            </div>
          </div>

          <Image
            alt={"phone screenshot"}
            className={"justify-self-center md:justify-self-end"}
            height={424}
            src={"/home/Phoneq.png"}
            width={211}
          />
        </div>

        <div className={"w-[80%] md:w-1/6 h-[30px] relative mx-auto"}>
          <svg
            className={"invert dark:invert-0 antialiased"}
            preserveAspectRatio="none"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0",
              left: "0",
            }}
            viewBox="0 0 100 100"
          >
            <polyline
              points="0,0 50,100 100,0"
              style={{ fill: "none", stroke: "white", strokeWidth: "2" }}
            />
          </svg>
        </div>
      </section>

      <section className={"w-full"} id={"about"}>
        <div className="mb-16">
          <h2 className={title()}>About</h2>
          <p className={subtitle()}>
            LearnCenter is a platform that allows you to create quizzes and
            share them with your friends. You can also take quizzes created by
            other users.
          </p>
        </div>

        <Image
          alt={"pc screenshot"}
          className={"mx-auto"}
          height={620 * 0.8}
          src={"/home/Pcq.png"}
          width={877 * 0.8}
        />
      </section>
    </main>
  );
}
