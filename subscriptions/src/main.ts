if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

import express from "express";
import logger from "logger";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.log({
        level: "info",
        message: "Server started on port: " + PORT
    });
});
