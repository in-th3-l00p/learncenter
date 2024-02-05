import {Response, NextFunction} from "express";
import {UserRequest} from "../utils/types";

export default async function customer(
    req: UserRequest,
    res: Response,
    next: NextFunction
) {
    if (!req.user?.customerId)
        return res
            .status(400)
            .send({
                errors: [{
                    msg: "Customer not initialized"
                }]
            });
    next();
}