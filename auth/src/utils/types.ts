import { Request } from "express";

export type UserDto = {
    id: Number;
    username: String;
    email: String;
    createdAt: Date;
}

export interface UserRequest extends Request {
    user?: UserDto;
}