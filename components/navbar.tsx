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

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

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
  );
};

const DesktopNavbarContent = () => {
  return (
    <>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
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

      <NavbarContent
        className="hidden sm:flex items-center basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarAccount />

        <NavbarItem className="hidden sm:block">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </>
  );
};

const MobileNavbarAccount = () => {
  const session = useSession();

  if (session.status === "loading") return <></>;
  if (session.status === "unauthenticated")
    return (
      <NavbarMenuItem>
        <Link color={"primary"} href="#" size="lg" onClick={() => signIn()}>
          Login
        </Link>
      </NavbarMenuItem>
    );

  return (
    <>
      <NavbarMenuItem className={"mt-8"}>
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
        <Link color={"primary"} href={"/profile"} size="lg">
          Profile
        </Link>
      </NavbarMenuItem>
      <NavbarMenuItem>
        <Link color={"primary"} href="#" size="lg" onClick={() => signOut()}>
          Logout
        </Link>
      </NavbarMenuItem>
    </>
  );
};

const MobileNavbarContent = () => {
  const session = useSession();

  return (
    <>
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-8 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
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
      <DesktopNavbarContent />
      <MobileNavbarContent />
    </NextUINavbar>
  );
};
