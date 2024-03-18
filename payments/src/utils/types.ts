import { Request } from "express";
import Stripe from "stripe";
import {UserDto as GlobalUserDto} from "types/src/dtos";

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
