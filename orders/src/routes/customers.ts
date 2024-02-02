import express, { Response } from "express";
import {stripeCustomerToDto, UserDto, UserRequest} from "../utils/types";
import {prisma, stripe} from "../utils/objects";
import {
    body,
    matchedData
} from "express-validator";
import logger from "logger";

import { validateRequest } from "middleware";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
    "/",
    authenticate,
    async (req: UserRequest, res) => {
        if (!req.user?.customerId)
            return res
                .status(404)
                .send({
                    errors: [{
                        msg: "Customer not initialized"
                    }]
                });

        const customer = await stripe.customers.retrieve(
            req.user.customerId
        );
        if (customer.deleted)
            return res
                .status(400)
                .send({
                    errors: [{
                        msg: "Customer deleted"
                    }]
                });
        res.json(stripeCustomerToDto(customer));
    });

const customerValidation = [
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

function getCustomerParams(user: UserDto, data: Record<string, any>): CustomerParams {
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

router.post(
    "/",
    customerValidation,
    authenticate,
    validateRequest,
    async (req: UserRequest, res: Response) => {
        if (req.user?.customerId)
            return res
                .status(400)
                .send({
                    errors: [{
                        msg: "Customer already initialized"
                    }]
                });

        try {
            const customerParams = getCustomerParams(req.user!, matchedData(req));
            const stripeCustomer = await stripe.customers.create(customerParams);
            logger.info("Customer created: " + JSON.stringify(stripeCustomer));

            const customer = await prisma.customer.create({
                data: {
                    id: stripeCustomer.id,
                    user: {
                        connect: {
                            id: req.user?.id
                        }
                    },
                    ...customerParamsToPrisma(customerParams)
                }
            });
            logger.debug("Customer saved: " + customer.id);

            res.send(stripeCustomerToDto(stripeCustomer));
        } catch (err) {
            logger.error("Error creating customer: " + err);
            res.status(500).send({
                errors: [{
                    msg: "Internal Server Error"
                }]
            });
        }
    });

router.put(
    "/",
    authenticate,
    customerValidation,
    validateRequest,
    (req: UserRequest, res: Response) => {
        if (!req.user?.customerId)
            return res
                .status(404)
                .send({
                    errors: [{
                        msg: "Customer not initialized"
                    }]
                });

        const customerParams = getCustomerParams(req.user, matchedData(req));
        stripe.customers.update(
            req.user.customerId,
            customerParams
        ).then(customer => {
            prisma.customer.update({
                where: { id: customer.id },
                data: customerParamsToPrisma(customerParams)
            });

            res.send(stripeCustomerToDto(customer));
        }).catch(err => {
            logger.error("Error updating customer: " + err);
            res.status(500).send({
                errors: [{
                    msg: "Internal Server Error"
                }]
            });
        });
    });

router.delete(
    "/",
    authenticate,
    (req: UserRequest, res) => {
        if (!req.user?.customerId)
            return res
                .status(404)
                .send({
                    errors: [{
                        msg: "Customer not initialized"
                    }]
                });

        const customerId = req.user?.customerId;
        stripe.customers.del(
            req.user.customerId
        ).then(() => {
            prisma.user.update({
                where: {
                    id: req.user?.id
                },
                data: {
                    customerId: null
                }
            }).then(() => {
                logger.info(`Customer ${customerId} deleted.`);
                res.send({
                    msg: "Customer deleted"
                });
            }).catch(err => {
                logger.error("Error deleting customer: " + err);
                res.status(500).send({
                    errors: [{
                        msg: "Internal Server Error"
                    }]
                });
            });
        }).catch(err => {
            logger.error("Error deleting customer: " + err);
            res.status(500).send({
                errors: [{
                    msg: "Internal Server Error"
                }]
            });
        });
    });

export default router;