import express from "express";
import authenticate from "../middleware/authenticate";
import {prisma, stripe} from "../utils/objects";
import {body, matchedData} from "express-validator";
import customer from "../middleware/customer";
import {validateRequest} from "middleware";
import {UserRequest} from "../utils/types";
import logger from "logger";
import {CheckoutType} from "../../../shared/types";

const router = express.Router();

router.post(
    "/package",
    authenticate,
    customer,
    body("institutionId").isNumeric().notEmpty().custom(async (value: number) => {
        if (await prisma.institution.count({ where: { id: value } }) === 0)
            throw new Error("Institution not found");
    }),
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

        const institution = await prisma.institution.findUnique({
            where: { id: data.institutionId }
        });
        if (!institution)
            return res
                .status(404)
                .json({ errors: [{
                        msg: "Institution not found"
                    }] });

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [{
                    price: selectedPackage.priceId,
                    quantity: 1,
                }],
                metadata: {
                    type: CheckoutType.INSTITUTION_SUBSCRIPTION,
                    institutionId: institution.id,
                    packageId: selectedPackage.id
                },
                success_url: "https://example.com/success",
                mode: "subscription",
                customer: req.user!.customerId!
            });

            logger.debug("Checkout session created: ", JSON.stringify(session));
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
