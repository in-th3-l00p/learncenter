import { PrismaClient } from '@prisma/client';
import {constants} from "./constants";

export const prisma = new PrismaClient();
export const redis = require("redis").createClient({
    url: constants.REDIS_URL
});

redis.connect()
    .then(() => console.log("Connected to Redis."))
    .catch((err: any) => console.log(err));