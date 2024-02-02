import express, { Response } from "express";
import authenticate from "../middleware/authenticate";
import {UserRequest} from "../utils/types";
import {prisma, stripe} from "../utils/objects";
import {
    body,
    matchedData
} from "express-validator";
import {validateRequest} from "../middleware/validateRequest";
import {logger} from "../utils/logger";

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
        res.json(customer);
    });

const customerValidation = [
    body("address.city").notEmpty(),
    body("address.country").notEmpty(),
    body("address.line1").notEmpty(),
    body("address.line2").notEmpty(),
    body("address.postal_code").notEmpty(),
    body("address.state").notEmpty(),
    body("phone").notEmpty(),
    body("shipping.address.city").notEmpty(),
    body("shipping.address.country").notEmpty(),
    body("shipping.address.line1").notEmpty(),
    body("shipping.address.line2").notEmpty(),
    body("shipping.address.postal_code").notEmpty(),
    body("shipping.address.state").notEmpty(),
    body("shipping.name").notEmpty(),
    body("shipping.phone").notEmpty(),
];

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
            const customer = await stripe.customers.create({
                ...matchedData(req),
                "name": req.user?.username,
                "email": req.user?.email
            });

            await prisma.user.update({
                where: {
                    id: req.user?.id
                },
                data: {
                    customerId: customer.id
                }
            });
            logger.info("Customer created: " + JSON.stringify(customer));

            res.send(customer);
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

        stripe.customers.update(
            req.user.customerId,
            matchedData(req)
        ).then(customer => {
            res.json(customer);
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