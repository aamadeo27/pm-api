import { Router } from "express";
import * as auth from "../../controllers/auth";

const authRouter = Router()

authRouter.post('/', auth.login)
authRouter.get('/', auth.tokens)


export default authRouter