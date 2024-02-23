import logger from "logger";

if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();

import express from 'express';
import "express-async-errors";
import cors from "cors";

import RegisterRouter from "./routes/register";
import LoginRouter from "./routes/login";
import UserRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use(cors());

app.use(RegisterRouter);
app.use(LoginRouter);
app.use(UserRouter);

(async () => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info("Server is running on port " + PORT + "...");
    });
})();