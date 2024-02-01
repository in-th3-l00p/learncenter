import express from "express";
import {validateRequest} from "../utils/middleware";
import Stripe from "stripe";
import {logger, prisma} from "../utils/objects";

const router = express.Router();

router.post(
    "/stripeWebhook",
    validateRequest,
    async (req, res) => {
        const event = req.body as Stripe.Event;
        switch (event.type) {
            case "product.updated":
                prisma
                    .package
                    .update({
                        where: { id: event.data.object.id },
                        data: {
                            name: event.data.object.name,
                            description: event.data.object.description
                        }
                    })
                    .then(() => logger.info("Updated package: " + event.data.object.id))
                    .catch((err) => logger.error(`Updating package (${event.data.object.id}):  ${err}`));
                break;
            case "price.updated":
                prisma
                    .price
                    .update({
                        where: { id: event.data.object.id },
                        data: {
                            unitAmount: event.data.object.unit_amount!,
                            currency: event.data.object.currency,
                            recurringInterval: event.data.object.recurring?.interval!
                        }
                    })
                    .then(() => logger.info("Updated price: " + event.data.object.id))
                    .catch((err) => logger.error(`Updating price (${event.data.object.id}):  ${err}`));
                break;
            case "product.deleted":
                prisma.package.delete({ where: { id: event.data.object.id } });
                break;
            case "price.deleted":
                prisma.price.delete({ where: { id: event.data.object.id } });
                break;
        }
    });

export default router;