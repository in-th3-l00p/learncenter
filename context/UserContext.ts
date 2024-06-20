"use client";

import React from "react";

import { IUser } from "@/models/User";

export interface IUserContext {
  user: IUser | null;
}

const UserContext = React.createContext<IUserContext>({} as IUserContext);

export default UserContext;
