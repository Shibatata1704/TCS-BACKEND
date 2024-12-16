import { Router } from "express";
import UserController from "../controllers/userController.js";

const UserRoutes = Router();


UserRoutes.get("/", UserController.getUsers);
UserRoutes.get("/:email", UserController.getUserByEmail);
UserRoutes.post("/", UserController.addUser);
UserRoutes.put("/:email", UserController.updateUser);
UserRoutes.delete("/:email", UserController.deleteUser);
// UserRoutes.get("/:email", UserController.getUserByToken);



//authRoutes.post("/User", AuthController.loginUser);

export default UserRoutes;
