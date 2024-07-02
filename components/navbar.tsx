"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

const NavbarAccount = () => {
  const session = useSession();

  if (session.status === "loading") return <></>;
  if (session.status === "unauthenticated")
    return (
      <NavbarItem>
        <NextLink href={"#"} onClick={() => signIn()}>
          Login
        </NextLink>
      </NavbarItem>
    );

  return (
    <>
      <NavbarItem className={"me-4"}>
        <NextLink href={"/dashboard"}>Dashboard</NextLink>
      </NavbarItem>
      <NavbarItem>
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: session.data?.user.image || "",
              }}
              className="transition-transform"
              name={session.data?.user.name || ""}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{session.data?.user.name}</p>
            </DropdownItem>
            <DropdownItem key="profile" href={"/profile"}>
              Profile
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    </>
  );
};

const DesktopNavbarContent = () => {
  return (
    <NavbarContent
      className="hidden lg:flex items-center basis-1/5 lg:basis-full"
      justify="end"
    >
      <NavbarAccount />

      <NavbarItem className="hidden lg:block">
        <ThemeSwitch />
      </NavbarItem>
    </NavbarContent>
  );
};

const MobileNavbarAccount = () => {
  const session = useSession();

  if (session.status === "loading") return <></>;
  if (session.status === "unauthenticated")
    return (
      <NavbarMenuItem>
        <Link
          color={"foreground"}
          href="#"
          size="lg"
          onClick={() => signIn()}
        >
          Login
        </Link>
      </NavbarMenuItem>
    );

  return (
    <>
      <NavbarMenuItem className={"pt-4 mb-4 mt-auto border-t"}>
        <Link color={"foreground"} href={"/dashboard"} size="lg">
          Dashboard
        </Link>
      </NavbarMenuItem>
      <NavbarMenuItem>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: session.data?.user.image || "",
          }}
          className="transition-transform"
          disabled={true}
          name={session.data?.user.name || ""}
        />
      </NavbarMenuItem>
      <NavbarMenuItem>
        <Link color={"foreground"} href={"/profile"} size="lg">
          Profile
        </Link>
      </NavbarMenuItem>
      <NavbarMenuItem className={"mb-8"}>
        <Link color={"foreground"} href="#" size="lg" onClick={() => signOut()}>
          Logout
        </Link>
      </NavbarMenuItem>
    </>
  );
};

const MobileNavbarContent = () => {
  return (
    <>
      <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-8 flex flex-col gap-2 h-full">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={"foreground"}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}

          <MobileNavbarAccount />
        </div>
      </NavbarMenu>
    </>
  );
};

export const Navbar = () => {
  return (
    <NextUINavbar className={"py-4"} maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 lg:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              alt={"Logo"}
              className={"invert dark:invert-0"}
              height={45}
              src={"/logo.png"}
              width={45}
            />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <DesktopNavbarContent />
      <MobileNavbarContent />
    </NextUINavbar>
  );
};
