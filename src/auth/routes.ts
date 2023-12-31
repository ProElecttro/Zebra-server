import { Router } from "express";
import {controller} from "./controller";
import verifyJwt from "../middleware/jwt";
export const authRoutes = Router();

authRoutes.post('/refresh',controller.refresh);
authRoutes.post('/login',controller.login);
authRoutes.post('/register',controller.register);
authRoutes.post('/logout',verifyJwt,controller.logout);