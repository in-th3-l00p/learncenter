import { Request } from "express";

export type UserDto = {
    id: number;
    username: string;
    email: string;
    customerId: string | null;
}

export interface UserRequest extends Request {
    user?: UserDto;
}
