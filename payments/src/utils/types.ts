import { Request, Response } from "express";
import { UserDto as GlobalUserDto } from "dtos";
import Stripe from "stripe";

type ExcludedDateUserDto = Omit<GlobalUserDto, "createdAt">;
export interface UserDto extends ExcludedDateUserDto {
    customerId: string | null;
}

export interface UserRequest extends Request {
    user?: UserDto;
}

export default interface CustomerDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: Stripe.Address | null;
    shipping: Stripe.Customer.Shipping | null;
}

export function stripeCustomerToDto(customer: Stripe.Customer): CustomerDto {
    return {
        id: customer.id,
        name: customer.name!,
        email: customer.email!,
        phone: customer.phone!,
        address: customer.address,
        shipping: customer.shipping
    };
}

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

export function handleServiceError(res: Response) {
    // todo
}