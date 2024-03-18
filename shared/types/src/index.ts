import {Request, Response} from "express";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface UserRequest<T> extends Request {
    user?: T;
}

export type UserInstitutionRole = "ADMIN" | "USER" | "PENDING" | "BANNED" | "DELETED";

export class ServiceError extends Error {
    private readonly _body: {
        msg: string;
    }[];

    constructor(
        private _status: number,
        errors: string[]
    ) {
        super();
        this._body = errors.map(error => ({
            msg: error
        }));
    }

    get status(): number {
        return this._status;
    }

    get body(): any {
        return this._body;
    }
}

export function handleServiceError(res: Response, err: any) {
    if (err instanceof ServiceError) {
        res.status(err.status).send(err.body);
    } else {
        res.status(500).send([{ msg: "Internal server error" }]);
    }
}

export enum CheckoutType {
    INSTITUTION_SUBSCRIPTION
}
