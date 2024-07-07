import { subtitle, title } from "@/components/primitives";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import Image from "next/image";

function Social({ icon, alt, name, href, size = 100 }: {
  icon: string;
  alt: string;
  name: string;
  href: string;
  size?: number;
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
        height={size}
        src={icon}
        width={size}
        className={"dark:invert"}
      />
      <p className="text-xl">{name}</p>
    </Link>
  );
}

export function Socials({ size = 100 }: {
  size?: number;
}) {
  return (
    <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16"}>
      <Social
        icon={"/home/socials/instagram.svg"}
        alt={"instagram icon"}
        name={"Instagram"}
        href={"https://www.instagram.com/learncenter__"}
        size={size}
      />

      <Social
        icon={"/home/socials/facebook.svg"}
        alt={"facebook icon"}
        name={"Facebook"}
        href={"https://www.facebook.com/profile.php?id=61562093695947"}
        size={size}
      />

      <Social
        icon={"/home/socials/tiktok.svg"}
        alt={"tiktok icon"}
        name={"TikTok"}
        href={"https://www.tiktok.com/@learncenter"}
        size={size}
      />

      <Social
        icon={"/home/socials/discord.svg"}
        alt={"discord icon"}
        name={"Discord"}
        href={"https://discord.gg/DJQASB96"}
        size={size}
      />
    </div>
  );
}

export default function SocialSection() {
  return (
    <section className="mb-32">
      <div className="mb-16 text-center">
        <h2 className={title()}>Connect with Us on Social Media</h2>
        <p className={subtitle()}>Follow Our Latest Updates and Join the Conversation</p>
      </div>

      <Socials />
    </section>
  );
}
