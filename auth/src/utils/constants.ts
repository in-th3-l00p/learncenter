export namespace constants {
    export const SECRET: string = process.env.SECRET || "jfdsakjfbdsakjfndsalkjlkdsahlkdsj";
    export const JWT_EXPIRE = 3600000000; // seconds
    export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
    export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
    export const AMQP_QUEUE = "auth";
}
