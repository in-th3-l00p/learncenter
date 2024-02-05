import * as nats from "nats";
import logger from "logger";
import userCreatedListener from "./authListener";
import institutionListener from "./institutionListener";

export let nc: nats.NatsConnection;
export const connectNats = async () => {
    try {
        nc = await nats.connect({
            servers: process.env.NATS_URL!
        });
        logger.debug("Connected to NATS.");
        listen(nc);
    } catch (err: any) {
        logger.error("Failed to connect to NATS: " + err);
    }
};

function listen(nc: nats.NatsConnection) {
    userCreatedListener(nc);
    institutionListener(nc);
}