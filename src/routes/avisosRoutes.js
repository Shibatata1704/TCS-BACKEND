import { Router } from "express";
import AvisosController from "../controllers/avisoController.js";

const AvisosRoutes = Router();


// AvisosRoutes.get("/", AvisosController.getAvisos);
AvisosRoutes.get("/:id", AvisosController.getAvisosByIDCategoria);
AvisosRoutes.post("/", AvisosController.addAvisos);
AvisosRoutes.put("/:id", AvisosController.updateAvisos);
AvisosRoutes.delete("/:id", AvisosController.deleteAvisos);


export default AvisosRoutes;