import express from 'express';
import loadStripeData from "./utils/stripeLoading";
import {logger} from "./utils/objects";
import stripeWebhook from "./routes/stripeWebhook";

const app = express();

app.use(express.json());

app.use(stripeWebhook);

loadStripeData()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            logger.log({
                level: "info",
                message: "Server started on port: " + PORT
            });
        });
    })