import express from "express";
import Stripe from "stripe";
import {prisma} from "../utils/objects";
import {validateRequest} from "middleware";
import logger from "logger";
import {nc} from "../events/nats";
import {CheckoutType} from "dtos";

const router = express.Router();

router.post(
    "/stripeWebhook",
    validateRequest,
    async (req) => {
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
                    .then(() =>
                        logger.info("Updated package: " + event.data.object.id)
                    )
                    .catch((err: any) =>
                        logger.error(`Updating package (${event.data.object.id}):  ${err}`)
                    );
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
                    .then(() =>
                        logger.info("Updated price: " + event.data.object.id)
                    )
                    .catch((err: any) =>
                        logger.error(`Updating price (${event.data.object.id}):  ${err}`)
                    );
                break;
            case "product.deleted":
                prisma.package.delete({ where: { id: event.data.object.id } })
                    .then(() =>
                        logger.info("Deleted package: " + event.data.object.id)
                    )
                    .catch((err: any) =>
                        logger.error(`Deleting package (${event.data.object.id}):  ${err}`)
                    );
                break;
            case "price.deleted":
                prisma.price.delete({ where: { id: event.data.object.id } })
                    .then(() =>
                        logger.info("Deleted price: " + event.data.object.id)
                    )
                    .catch((err: any) =>
                        logger.error(`Deleting price (${event.data.object.id}):  ${err}`)
                    );
                break;
            case "checkout.session.completed":
                nc.publish("payments:checkoutCompleted", JSON.stringify(event.data));
                logger.info("Checkout completed: " + event.data.object.id);

                try {
                    if (
                        parseInt(event.data.object.metadata!.type) ===
                        CheckoutType.INSTITUTION_SUBSCRIPTION
                    ) {
                        const institutionId: number = parseInt(
                            event.data.object.metadata!.institutionId
                        );
                        const institution = await prisma.institution.findUnique({
                            where: {id: institutionId}
                        });
                        if (!institution) {
                            logger.error(
                                "Invalid institution id on checkout success: " +
                                event.data.object
                            );
                            return;
                        }

                        const packageId: string = event.data.object.metadata!.packageId;
                        const selectedPackage = await prisma.package.findUnique({
                            where: {id: packageId}
                        });
                        if (!selectedPackage) {
                            logger.error(
                                "Invalid package id on checkout success: " +
                                JSON.stringify(event.data.object)
                            );
                            return;
                        }

                        await prisma.institution.update({
                            where: {id: institutionId},
                            data: {
                                package: {
                                    connect: {id: selectedPackage.id}
                                }
                            }
                        });

                        nc.publish(
                            "payments:institutionUpdated",
                            JSON.stringify({
                                institutionId: institution.id,
                                package: selectedPackage
                            })
                        );
                    }
                } catch (err: any) {
                    logger.error(
                        "Failed to process checkout success: " +
                        JSON.stringify(err)
                    );
                }

                break;
        }
    });

export default router;