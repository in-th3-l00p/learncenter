if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();

import express from 'express';
import RegisterRouter from "./routes/register";
import LoginRouter from "./routes/login";
import UserRouter from "./routes/users";

const app = express();

app.use(express.json());

app.use(RegisterRouter);
app.use(LoginRouter);
app.use(UserRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT + "...");
});