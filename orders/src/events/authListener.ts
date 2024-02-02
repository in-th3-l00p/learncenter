import {NatsConnection} from "nats";
import {prisma} from "../utils/objects";
import {logger} from "../utils/logger";
import {UserDto} from "../utils/types";

export default async function userCreatedListener(nc: NatsConnection) {
    const sub = nc.subscribe("auth:userCreated");
    for await (const msg of sub) {
        const user: UserDto = msg.json();
        prisma.user.create({ data: {
            id: user.id,
            username: user.username,
            email: user.email
        }})
            .then(() => {
                logger.info("Created user: " + JSON.stringify(user));
            })
            .catch((err: any) => {
                logger.error("Failed to create user: " + err);
            });
    }
}