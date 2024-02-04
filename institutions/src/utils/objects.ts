import {PrismaClient} from "@prisma/client";
import logger from "logger";

export const prisma = new PrismaClient();
prisma.$connect()
    .then(() => logger.debug("Connected to the database"));