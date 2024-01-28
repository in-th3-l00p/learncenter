if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();

import express from 'express';
import RegisterRouter from "./routes/register";

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(RegisterRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT + "...");
});