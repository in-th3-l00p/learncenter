import Stripe from "stripe";
import {PrismaClient} from "@prisma/client";
import logger from "logger";

export const redis = require("redis").createClient({
    url: process.env.REDIS_URL
});

export const prisma = new PrismaClient();
prisma.$connect()
    .then(() => logger.log({
        level: "debug",
        message: "Connected to Prisma"
    }))
    .catch((err: any) => logger.error("Failed to connect to Prisma: " + err))

redis.connect()
    .then(() => logger.log({
        level: "debug",
        message: "Connected to Redis"
    }))
    .catch((err: any) => logger.error("Failed to connect to Redis: ", err));

export const stripe = new Stripe(process.env.STRIPE_KEY!);

