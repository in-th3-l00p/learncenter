import logger from "logger";

if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();

import express from 'express';
import cors from "cors";
import {connectNats} from "./utils/connections";

import RegisterRouter from "./routes/register";
import LoginRouter from "./routes/login";
import UserRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use(cors());

app.use(RegisterRouter);
app.use(LoginRouter);
app.use(UserRouter);

connectNats()
    .then(() => {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        logger.info("Server is running on port " + PORT + "...");
      });
    });