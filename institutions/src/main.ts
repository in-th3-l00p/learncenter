import express from "express";
import "express-async-errors";
import cors from "cors";
import Amqp from "streaming";
import setupConsumers from "./events/setupConsumers";
import logger from "logger";

import InstitutionsRouter from "./routes/institutions";
import UsersRouter from "./routes/users";

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/institutions", InstitutionsRouter);
app.use("/api/institutions/users", UsersRouter);

(async () => {
    await Amqp.initializeFromEnv(logger);
    setupConsumers();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.log({
            level: "info",
            message: "Server started on port: " + PORT
        });
    });
})();
