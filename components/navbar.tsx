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
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const session = useSession();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
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
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {session.status !== "loading" && (
          <>
            {session.status === "authenticated" && (
              <NavbarItem>
                <NextLink href={"#"} onClick={() => signOut()}>
                  Logout
                </NextLink>
              </NavbarItem>
            )}
            {session.status === "unauthenticated" && (
              <>
                <NavbarItem>
                  <NextLink href={"#"} onClick={() => signIn()}>
                    Login
                  </NextLink>
                </NavbarItem>
              </>
            )}
          </>
        )}

        <NavbarItem className="hidden sm:block">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
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

          {session.status !== "loading" && (
            <>
              {session.status === "authenticated" && (
                <NavbarMenuItem>
                  <Link
                    color={"primary"}
                    href="#"
                    size="lg"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Link>
                </NavbarMenuItem>
              )}
              {session.status === "unauthenticated" && (
                <NavbarMenuItem>
                  <Link
                    color={"primary"}
                    href="#"
                    size="lg"
                    onClick={() => signIn()}
                  >
                    Login
                  </Link>
                </NavbarMenuItem>
              )}
            </>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
