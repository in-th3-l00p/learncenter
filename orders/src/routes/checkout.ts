import express from "express";
import authenticate from "../middleware/authenticate";
import {prisma, stripe} from "../utils/objects";
import {body, matchedData} from "express-validator";
import customer from "../middleware/customer";
import {validateRequest} from "middleware";
import {UserRequest} from "../utils/types";
import logger from "logger";

const router = express.Router();

type Item = {
    id: string;
    quantity: number;
};

router.post(
    "/package",
    authenticate,
    customer,
    body("packageId").notEmpty().custom(async (value: string) => {
        if (await prisma.package.count({ where: { id: value } }) === 0)
            throw new Error("Package not found");
    }),
    validateRequest,
    async (req: UserRequest, res) => {
        const data = matchedData(req);
        const selectedPackage = await prisma.package.findUnique({
            where: {
                id: data.packageId
            }
        });
        if (!selectedPackage)
            return res
                .status(404)
                .json({ errors: [{
                        msg: "Package not found"
                    }] });

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [{
                    price: selectedPackage.priceId,
                    quantity: 1,
                }],
                success_url: "https://example.com/success",
                mode: "subscription",
                customer: req.user!.customerId!
            });

            return res.json(session);
        } catch (err) {
            logger.error("Failed to process package checkout: " + err);
            return res
                .status(500)
                .json({
                    errors: [{
                        msg: "Internal Server Error"
                    }]
                });
        }
    });

export default router;
