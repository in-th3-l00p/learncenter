import CustomerDto, {ServiceError, stripeCustomerToDto, UserDto} from "../utils/types";
import {body} from "express-validator";
import {prisma, stripe} from "../utils/objects";
import logger from "logger";
import {nc} from "../events/nats";

export const customerValidation = [
    body("address.city"),
    body("address.country"),
    body("address.line1"),
    body("address.line2"),
    body("address.postal_code"),
    body("address.state"),
    body("shipping.address.city").notEmpty(),
    body("shipping.address.country").notEmpty(),
    body("shipping.address.line1").notEmpty(),
    body("shipping.address.line2").notEmpty(),
    body("shipping.address.postal_code").notEmpty(),
    body("shipping.address.state").notEmpty()
];

type CustomerParams = {
    name: string,
    email: string,
    phone: string,
    address?: {
        city?: string,
        country?: string,
        line1?: string,
        line2?: string,
        postal_code?: string,
        state?: string
    },
    shipping: {
        address: {
            city: string,
            country: string,
            line1: string,
            line2: string,
            postal_code: string,
            state: string
        },
        name: string,
        phone: string
    }
};

export function getCustomerParams(user: UserDto, data: Record<string, any>): CustomerParams {
    return {
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
        address: {
            city: data.address.city,
            country: data.address.country,
            line1: data.address.line1,
            line2: data.address.line2,
            postal_code: data.address.postal_code,
            state: data.address.state
        },
        shipping: {
            address: {
                city: data.shipping.address.city,
                country: data.shipping.address.country,
                line1: data.shipping.address.line1,
                line2: data.shipping.address.line2,
                postal_code: data.shipping.address.postal_code,
                state: data.shipping.address.state
            },
            name: user.firstName + " " + user.lastName,
            phone: user.phone
        }
    };
}

function customerParamsToPrisma(params: CustomerParams) {
    return {
        addressCity: params.address?.city,
        addressCountry: params.address?.country,
        addressLine1: params.address?.line1,
        addressLine2: params.address?.line2,
        addressPostalCode: params.address?.postal_code,
        addressState: params.address?.state,
        shippingAddressCity: params.shipping.address.city,
        shippingAddressCountry: params.shipping.address.country,
        shippingAddressLine1: params.shipping.address.line1,
        shippingAddressLine2: params.shipping.address.line2,
        shippingAddressPostalCode: params.shipping.address.postal_code,
        shippingAddressState: params.shipping.address.state,
        shippingName: params.shipping.name,
        shippingPhone: params.shipping.phone
    }
}

class CustomerService {
    async createCustomer(customerParams: CustomerParams, user: UserDto): Promise<CustomerDto> {
        const stripeCustomer = await stripe.customers.create(customerParams);
        logger.info("Customer created: " + JSON.stringify(stripeCustomer));

        const dto = stripeCustomerToDto(stripeCustomer);
        nc.publish("payments:customerCreated", JSON.stringify(dto));

        const customer = await prisma.customer.create({
            data: {
                id: stripeCustomer.id,
                user: {
                    connect: {
                        id: user.id
                    }
                },
                ...customerParamsToPrisma(customerParams)
            }
        });
        logger.debug("Customer saved: " + customer.id);
        return dto;
    }

    async getCustomer(customerId: string) {
        const customer = await stripe.customers.retrieve(
            customerId
        );
        if (!customer)
            throw new ServiceError(404, ["Customer doesn't exist"]);
        if (customer.deleted)
            throw new ServiceError(400, ["Deleted customer"]);
        return stripeCustomerToDto(customer);
    }

    async updateCustomer(customerId: string, customerParams: CustomerParams) {
        try {
            const stripeCustomer = await stripe.customers.update(customerId, customerParams)
            await prisma.customer.update({
                where: {id: stripeCustomer.id},
                data: customerParamsToPrisma(customerParams)
            });
            logger.info(`Customer ${stripeCustomer.id} updated!`);
            const dto = stripeCustomerToDto(stripeCustomer);
            nc.publish("payments:customerUpdated", JSON.stringify(dto));
            return dto;
        } catch (err: any) {
            logger.error("Error updating customer: " + err);
            throw new ServiceError(500, ["Internal Server Error"]);
        }
    }

    async deleteCustomer(customerId: string, userId: number) {
        try {
            await stripe.customers.del(customerId);
            await prisma.user.update({
                where: { id: userId },
                data: { customerId: null }
            });
            await prisma.customer.delete({
                where: { id: customerId }
            });

            logger.info(`Customer ${customerId} deleted.`);
        } catch (err: any) {
            logger.error("Error deleting customer: " + err);
            throw new ServiceError(500, ["Internal Server Error"]);
        }
    }
}

const customerService = new CustomerService();
export default customerService;