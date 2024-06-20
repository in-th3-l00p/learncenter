"use client";

import React from "react";

import UserContext from "@/context/UserContext";

export default function UserContextProvider({
  jsonUser,
  children,
}: {
  jsonUser: string | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider
      value={{ user: jsonUser ? JSON.parse(jsonUser) : null }}
    >
      {children}
    </UserContext.Provider>
  );
}
