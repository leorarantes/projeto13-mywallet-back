import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import walletRouter from "./routes/walletRouter.js";
import exitRouter from "./routes/exitRouter.js";

// config
const app = express();
app.use(json());
app.use(cors());
dotenv.config();

// routes
app.use(authRouter);
app.use(walletRouter);
app.use(exitRouter);

const port = /*process.env.PORT ||*/5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})