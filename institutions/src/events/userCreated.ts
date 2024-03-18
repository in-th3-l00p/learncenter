import Amqp from "streaming";
import logger from "logger";
import {prisma} from "../utils/objects";
import {EventType} from "streaming/src/event";
import {UserDto} from "types/src/dtos";

export default function userCreatedConsumer() {
    Amqp.getInstance().addConsumer(EventType.USER_CREATED, async (msg) => {
        const user: UserDto = msg.data;
        prisma.user.create({
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
            }
        })
            .then(() => {
                logger.info("Created user: " + JSON.stringify(user));
            })
            .catch((err: any) => {
                logger.error("Failed to create user: " + err);
            });
    });
}
