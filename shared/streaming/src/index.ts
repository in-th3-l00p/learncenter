import * as nats from "nats";

interface DesiredLogger {
    debug: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

class NatsStreaming {
    private nc: nats.NatsConnection | null = null;
    private jsm: nats.JetStreamManager | null = null;
    private js: nats.JetStreamClient | null = null;

    private readonly streamName: string;
    private readonly appName: string;

    private readonly logger?: DesiredLogger;

    private static instance: NatsStreaming;

    private async connect(
        natsUrl: string,
        streamName: string,
    ) {
        try {
            this.nc = await nats.connect({
                servers: natsUrl,
            });
            if (!this.nc && this.logger) {
                this.logger.error("Failed to connect to NATS.");
                return;
            }

            this.jsm = await this.nc.jetstreamManager();
            if (!this.jsm && this.logger) {
                this.logger.error("Failed to connect to JetStream Manager.");
                return;
            }

            try {
                await this.jsm.streams.add({
                    name: streamName,
                    subjects: [streamName + ".>"],
                });
            } catch (_: any) {}

            this.js = this.jsm.jetstream();
            if (!this.js && this.logger) {
                this.logger.error("Failed to connect to JetStream.");
                return;
            }

            if (this.logger) {
                this.logger.debug("Connected to NATS.");
            }
        } catch (err: any) {
            if (this.logger)
                this.logger.error("Failed to setting up NATS: " + err);
            process.exit(1);
        }
    }

    private constructor(
        natsUrl: string,
        streamName: string,
        appName: string,
        logger?: DesiredLogger
    ) {
        this.logger = logger;
        this.streamName = streamName;
        this.appName = appName;
        this.connect(natsUrl, streamName).then(() => {
            if (this.logger)
                this.logger.info("Connected to NATS.");
        });
    }

    public async publish(subject: string, data: any) {
        await this.js?.publish(this.streamName + "." + subject, data);
    }

    public async subscribe(
        subject: string,
        callback: (message: nats.JsMsg) => void
    ) {
        let consumer = await this.js?.consumers.get(this.streamName, this.appName + "." + subject);
        if (!consumer) {
            await this.jsm?.consumers.add(
                this.streamName, {
                    name: this.appName + "." + subject,
                    ack_policy: nats.AckPolicy.Explicit,
                    ack_wait: 60_000,
                    max_deliver: -1,
                });
            consumer = await this.js?.consumers.get(this.streamName, this.appName + "." + subject);
        }

        if (!consumer) {
            if (this.logger)
                this.logger.error("Failed to create consumer.");
            throw new Error("Failed to create consumer.");
        }

        for await (const message of await consumer.consume()) {
            callback(message);
        }
    }

    public async drain() {
        await this.nc?.drain();
    }

    public static async initialize(
        natsUrl: string,
        streamName: string,
        appName: string,
        logger?: DesiredLogger
    ) {
        if (!NatsStreaming.instance)
            NatsStreaming.instance = new NatsStreaming(natsUrl, streamName, appName, logger);
        return NatsStreaming.instance;
    }

    public static async initializeFromEnv(
        logger?: DesiredLogger
    ) {
        const natsUrl = process.env.NATS_URL;
        const streamName = process.env.NATS_STREAM_NAME;
        const appName = process.env.APP_NAME;
        if (!natsUrl || !streamName || !appName) {
            if (logger)
                logger.error("NATS_URL, NATS_STREAM_NAME and APP_NAME must be set.");
            throw new Error("NATS_URL, NATS_STREAM_NAME and APP_NAME must be set.");
        }
        return NatsStreaming.initialize(natsUrl, streamName, appName, logger);
    }

    public static isInitialized() {
        return !!NatsStreaming.instance;
    }

    public static getInstance() {
        if (!NatsStreaming.instance)
            throw new Error("NATS not initialized.");
        return NatsStreaming.instance;
    }
}

// draining the connection
process.on("SIGINT", async () => {
    if (NatsStreaming.isInitialized())
        await NatsStreaming.getInstance().drain();
    process.exit();
});

process.on("SIGTERM", async () => {
    if (NatsStreaming.isInitialized())
        await NatsStreaming.getInstance().drain();
    process.exit();
});

export default NatsStreaming;