export namespace constants {
    export const SECRET: string = process.env.SECRET || "jfdsakjfbdsakjfndsalkjlkdsahlkdsj";
    export const JWT_EXPIRE = 3600000000; // seconds
    export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

    export const NATS_URL = process.env.NATS_URL || "nats://localhost:4222";
    export const STREAMING_SERVICE_NAME = process.env.STREAMING_SERVICE_NAME || "auth";
}
