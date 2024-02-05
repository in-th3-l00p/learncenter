import express, { Response } from "express";
import {UserRequest} from "../utils/types";
import {
    matchedData
} from "express-validator";

import { validateRequest } from "middleware";
import authenticate from "../middleware/authenticate";
import customer from "../middleware/customer";
import customerService, {customerValidation, getCustomerParams} from "../service/CustomerService";

const router = express.Router();

router.get(
    "/",
    authenticate,
    customer,
    async (req: UserRequest, res) => {
        try {
            res.json(await customerService.getCustomer(req.user!.customerId!));
        } catch (err: any) {
            return res.status(404).send({
                errors: [{
                    msg: err.getMessage()
                }]
            });
        }
    });

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
            res.send(await customerService.createCustomer(customerParams, req.user!));
        } catch (err: any) {
            res.status(500).send({
                errors: [{
                    msg: err.getMessage()
                }]
            });
        }
    });

router.put(
    "/",
    authenticate,
    customerValidation,
    validateRequest,
    customer,
    async (req: UserRequest, res: Response) => {
        try {
            res.send(
                await customerService.updateCustomer(
                    req.user!.customerId!,
                    getCustomerParams(req.user!, matchedData(req))
                ));
        } catch (err: any) {
            res.status(500).send({ errors: [{
                msg: err.getMessage()
            }]});
        }
    });

router.delete(
    "/",
    authenticate,
    customer,
    async (req: UserRequest, res) => {
        try {
            await customerService.deleteCustomer(req.user!.customerId!, req.user!.id);
            return res.status(200).end();
        } catch (err: any) {
            return res.status(500).send({
                errors: [{
                    msg: err.getMessage()
                }]
            });
        }
    });

export default router;