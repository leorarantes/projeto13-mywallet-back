import {Router} from "express";

import { getWallet, setWallet } from "../controllers/walletController.js";

import {validateToken} from "../middlewares/authMiddleware.js";

const walletRouter = Router();

walletRouter.use(validateToken);

walletRouter.post("/wallets", setWallet);

walletRouter.get("/wallets", getWallet);

export default walletRouter;