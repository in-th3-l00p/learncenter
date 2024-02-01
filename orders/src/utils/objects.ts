import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import winston, {log} from "winston";
import * as path from "path";

export const redis = require("redis").createClient({
    url: process.env.REDIS_URL
});

export const prisma = new PrismaClient();
prisma.$connect()
    .then(() => logger.log({
        level: "debug",
        message: "Connected to Prisma"
    }))
    .catch(err => logger.error("Failed to connect to Prisma: " + err))

redis.connect()
    .then(() => logger.log({
        level: "debug",
        message: "Connected to Redis"
    }))
    .catch((err: any) => logger.error("Failed to connect to Redis: ", err));

export const stripe = new Stripe(process.env.STRIPE_KEY!);

export const logger = winston.createLogger({
    level: process.env.LOGGER_LEVEL || "debug",
    format: winston.format.json(),
    defaultMeta: { service: "orders-service" },
    transports: [
        new winston.transports.File({
            filename: path.join(process.env.PWD!, "logs/error.log"),
            level: "error"
        }),
        new winston.transports.File({
            filename: path.join(process.env.PWD!, "logs/info.log"),
            level: "info"
        }),
        new winston.transports.File({
            filename: path.join(process.env.PWD!, "logs/combined.log")
        })
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.cli()
    }));
}