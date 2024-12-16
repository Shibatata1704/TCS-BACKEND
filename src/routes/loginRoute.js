import { Router } from "express";
import AuthController from "../controllers/authController.js";

const loginRoute = Router();


loginRoute.post("", AuthController.loginUser);
// loginRoute.get("/", AuthController.checkWhitelist);

export default loginRoute;