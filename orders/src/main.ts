if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

import express from 'express';
import {logger} from "./utils/logger";

import stripeWebhook from "./routes/stripeWebhook";
import PackagesRouter from "./routes/packages";

const app = express();

app.use(express.json());

app.use("/api/orders", stripeWebhook);
app.use("/api/orders/packages", PackagesRouter);

logger.debug("AppService initialized successfully!");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.log({
        level: "info",
        message: "Server started on port: " + PORT
    });
});
