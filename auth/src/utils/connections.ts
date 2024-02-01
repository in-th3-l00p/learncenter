import { PrismaClient } from '@prisma/client';
import {constants} from "./constants";
import {logger} from "./logger";

export const prisma = new PrismaClient();
prisma.$connect()
    .then(() => logger.debug("Connected to Prisma."))
    .catch((err: any) => logger.error("Failed to connect to Prisma: " + err));

export const redis = require("redis").createClient({
    url: constants.REDIS_URL
});

redis.connect()
    .then(() => logger.debug("Connected to Redis."))
    .catch((err: any) => logger.error("Failed to connect to Redis: " + err));