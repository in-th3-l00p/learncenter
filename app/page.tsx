import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { getServerSession } from "next-auth";

import { subtitle, title } from "@/components/primitives";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

function Feature({ title, subtitle, icon, iconAlt, }: {
  title: string;
  subtitle: string;
  icon: string;
  iconAlt: string;
}) {
  return (
    <div className={"flex flex-col items-center text-center"}>
      <Image
        alt={iconAlt}
        height={100}
        src={icon}
        width={100}
        className={"dark:invert mb-4"}
      />
      <h3 className={"text-xl font-bold"}>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

function Social({ icon, alt, name, href }: {
  icon: string;
  alt: string;
  name: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-col items-center gap-2",
        "text-black dark:text-white",
        "hover:bg-zinc-200 dark:hover:bg-zinc-800 p-8 rounded-2xl"
      )}
    >
      <Image
        alt={alt}
        height={100}
        src={icon}
        width={100}
        className={"dark:invert"}
      />
      <p className="text-xl font-bold">{name}</p>
    </Link>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <section className="mb-32">
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

      <section
        className={"w-full mb-32 flex flex-col md:flex-row justify-between md:gap-48"}
        id={"about"}
      >
        <div className="mb-16">
          <h2 className={title()}>About</h2>
          <p className={subtitle()}>
            The all-in-one learning platform! Study smarter with AI tools and keep your resources organized easily.
          </p>

          <Button
            as={Link}
            href={"/about"}
            className={"mt-4"}
          >
            Learn more
          </Button>
        </div>

        <video
          width={"640"}
          height={"480"}
          controls
          className={"rounded-2xl mx-auto max-w-[550px]"}
        >
          <source src={"/home/showcase.mp4"} type="video/mp4" />
        </video>
      </section>

      <section
        className={"mb-32"}
      >
        <div className="mb-16">
          <h2 className={title()}>Features</h2>
          <p className={subtitle()}>
            The LearnCenter platform offers a variety of features to help you learn better.
          </p>
        </div>

        <div className={"grid grid-cols-1 md:grid-cols-3 gap-16"}>
          <Feature
            title={"Learn"}
            subtitle={"Study smarter with AI tools."}
            icon={"/home/learn.svg"}
            iconAlt={"Learn icon"}
          />

          <Feature
            title={"Organize"}
            subtitle={"Keep your resources organized easily."}
            icon={"/home/organize.svg"}
            iconAlt={"Organize icon"}
          />

          <Feature
            title={"Collaborate"}
            subtitle={"Collaborate with others to learn better."}
            icon={"/home/collaborate.svg"}
            iconAlt={"Collaborate icon"}
          />
        </div>
      </section>

      <section className="mb-32">
        <div className="mb-16 text-center">
          <h2 className={title()}>Connect with Us on Social Media</h2>
          <p className={subtitle()}>Follow Our Latest Updates and Join the Conversation</p>
        </div>

        <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16"}>
          <Social
            icon={"/home/socials/instagram.svg"}
            alt={"instagram icon"}
            name={"Instagram"}
            href={"https://www.instagram.com/learncenter__"}
          />

          <Social
            icon={"/home/socials/facebook.svg"}
            alt={"facebook icon"}
            name={"Facebook"}
            href={"https://www.facebook.com/profile.php?id=61562093695947"}
          />

          <Social
            icon={"/home/socials/tiktok.svg"}
            alt={"tiktok icon"}
            name={"TikTok"}
            href={"https://www.tiktok.com/@learncenter"}
          />

          <Social
            icon={"/home/socials/discord.svg"}
            alt={"discord icon"}
            name={"Discord"}
            href={"https://discord.gg/DJQASB96"}
          />
        </div>
      </section>
    </main>
  );
}
