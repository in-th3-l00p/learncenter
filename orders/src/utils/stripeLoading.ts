import {logger, prisma, stripe} from "./objects";

export default async function loadStripeData() {
    try {
        const products = await stripe.products.list();
        const prices = await stripe.prices.list();

        for (const price of prices.data) {
            try {
                logger.debug("Loading Stripe price: " + price.id);
                if (await prisma.price.count({ where: { id: price.id } }) > 0) {
                    const priceEntity = await prisma.price.findUnique({ where: { id: price.id } });
                    if (priceEntity?.unitAmount === price.unit_amount &&
                        priceEntity?.recurringInterval === price.recurring?.interval) {
                        logger.debug("Skipping Stripe price: " + price.id);
                        continue;
                    }

                    await prisma.price.update({
                        where: { id: price.id },
                        data: {
                            unitAmount: price.unit_amount!,
                            recurringInterval: price.recurring?.interval!,
                        }
                    });
                    logger.info("Updated Stripe price: " + price.id);
                    continue;
                }
                const priceEntity = await prisma.price.create({
                    data: {
                        id: price.id,
                        currency: price.currency,
                        unitAmount: price.unit_amount!,
                        recurringInterval: price.recurring?.interval!,
                    }
                });

                logger.debug("Loaded Stripe price: " + priceEntity.id);
            } catch (err: any) {
                logger.error(`Failed to load Stripe price (${JSON.stringify(price)}): ${err}`);
            }
        }

        for (const product of products.data) {
            try {
                logger.debug("Loading Stripe product: " + product.id);
                if (await prisma.package.count({ where: { id: product.id } }) > 0) {
                    const productEntity = await prisma.package.findUnique({ where: { id: product.id } });
                    if (productEntity?.name === product.name &&
                        productEntity?.description === product.description &&
                        productEntity?.priceId === product.default_price) {
                        logger.debug("Skipping Stripe product: " + product.id);
                        continue;
                    }

                    await prisma.package.update({
                        where: { id: product.id },
                        data: {
                            name: product.name,
                            description: product.description ? product.description : undefined,
                            priceId: typeof product.default_price === "string" ?
                                product.default_price :
                                product.default_price?.id!,
                        }
                    });
                    logger.info("Updated Stripe product: " + product.id);
                    continue;
                }

                const productEntity = await prisma.package.create({
                    data: {
                        id: product.id,
                        name: product.name,
                        description: product.description ? product.description : undefined,
                        priceId: typeof product.default_price === "string" ?
                            product.default_price :
                            product.default_price?.id!,
                    }
                });

                logger.info("Loaded Stripe product: " + productEntity.id);
            } catch (err: any) {
                logger.error(`Failed to load Stripe product (${JSON.stringify(product)}): ${err}`);
            }
        }
    } catch (err) {
        logger.error("Failed to load Stripe data: " + err);
    }
}