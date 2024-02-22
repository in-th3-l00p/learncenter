if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

import express from "express";
import "express-async-errors";
import cors from "cors";
import logger from "logger";
import NatsStreaming from "streaming";

import InstitutionsRouter from "./routes/institutions";
import UsersRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/institutions", InstitutionsRouter);
app.use("/api/institutions/users", UsersRouter);

NatsStreaming.initializeFromEnv(logger)
    .then(() => {
        NatsStreaming.getInstance().subscribe("institutions", (msg) => {
            console.log("received");
        });
    })
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            logger.log({
                level: "info",
                message: "Server started on port: " + PORT
            });
        });
    })
