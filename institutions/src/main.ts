import {connectNats} from "./events/nats";

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

import express from "express";
import cors from "cors";
import logger from "logger";

import InstitutionsRouter from "./routes/institutions";
import UsersRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/institutions", InstitutionsRouter);
app.use("/api/institutions/users", UsersRouter);

connectNats()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            logger.log({
                level: "info",
                message: "Server started on port: " + PORT
            });
        });
    })
