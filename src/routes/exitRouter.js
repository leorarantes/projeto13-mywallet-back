import {Router} from "express";

import { signOut } from "../controllers/exitController.js";

import {validateToken} from "../middlewares/authMiddleware.js";

const exitRouter = Router();

exitRouter.use(validateToken);

exitRouter.post("/sign-out", signOut);

export default exitRouter;