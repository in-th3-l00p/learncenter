
if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

import express from 'express';
import "express-async-errors";
import logger from "logger";

import stripeWebhook from "./routes/stripeWebhook";
import packagesRouter from "./routes/packages";
import customersRouter from "./routes/customers";
import checkoutRouter from "./routes/checkout";

const app = express();

app.use(express.json());

app.use("/api/payments", stripeWebhook);
app.use("/api/payments/packages", packagesRouter);
app.use("/api/payments/customers", customersRouter);
app.use("/api/payments/checkout", checkoutRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.log({
        level: "info",
        message: "Server started on port: " + PORT
    });
});
