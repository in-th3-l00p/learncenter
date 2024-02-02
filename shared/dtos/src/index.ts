import { Request } from "express";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type UserDto = {
    id: number;

    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;

    createdAt: Date;
}

export interface UserRequest<T> extends Request {
    user?: T;
}
