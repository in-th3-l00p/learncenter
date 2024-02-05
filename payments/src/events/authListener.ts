import {NatsConnection} from "nats";
import {prisma} from "../utils/objects";
import {UserDto} from "../utils/types";
import logger from "logger";

export default async function userCreatedListener(nc: NatsConnection) {
    const sub = nc.subscribe("auth:userCreated");
    for await (const msg of sub) {
        const user: UserDto = msg.json();
        prisma.user.create({ data: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
        }})
            .then(() => {
                logger.info("Created user: " + JSON.stringify(user));
            })
            .catch((err: any) => {
                logger.error("Failed to create user: " + err);
            });
    }
}