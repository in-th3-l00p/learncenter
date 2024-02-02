if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

import express from 'express';
import {logger} from "./utils/logger";
import {connectNats} from "./events/nats";

import stripeWebhook from "./routes/stripeWebhook";
import packagesRouter from "./routes/packages";
import customersRouter from "./routes/customers";

const app = express();

app.use(express.json());

app.use("/api/orders", stripeWebhook);
app.use("/api/orders/packages", packagesRouter);
app.use("/api/orders/customers", customersRouter);

connectNats()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            logger.log({
                level: "info",
                message: "Server started on port: " + PORT
            });
        });
    });
