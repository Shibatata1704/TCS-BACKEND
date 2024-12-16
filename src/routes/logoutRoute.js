import { Router } from "express";
import AuthController from "../controllers/authController.js";

const logoutRoute = Router();

logoutRoute.post("/", AuthController.logout);

export default logoutRoute;