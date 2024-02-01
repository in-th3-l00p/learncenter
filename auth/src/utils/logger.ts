import path from "path";
import winston from "winston";

export const logger = winston.createLogger({
    level: process.env.LOGGER_LEVEL || "debug",
    format: winston.format.json(),
    defaultMeta: { service: "orders-service" },
    transports: [
        new winston.transports.File({
            filename: path.join(process.env.PWD!, "logs/error.log"),
            level: "error"
        }),
        new winston.transports.File({
            filename: path.join(process.env.PWD!, "logs/info.log"),
            level: "info"
        }),
        new winston.transports.File({
            filename: path.join(process.env.PWD!, "logs/combined.log")
        })
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.cli()
    }));
}
