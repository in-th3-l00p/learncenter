import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export const redis = require("redis").createClient({
    url: process.env.REDIS_URL
});

redis.connect()
    .then(() => console.log("Connected to Redis."))
    .catch((err: any) => console.log(err));