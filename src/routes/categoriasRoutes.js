import { Router } from "express";
import CategoriasController from "../controllers/categoriaController.js";

const CategoriasRoutes = Router();


CategoriasRoutes.get("/", CategoriasController.getCategorias);
CategoriasRoutes.get("/:id", CategoriasController.getCategoriasByID);
CategoriasRoutes.post("/", CategoriasController.addCategorias);
CategoriasRoutes.put("/:id", CategoriasController.updateCategorias);
CategoriasRoutes.delete("/:id", CategoriasController.deleteCategorias);


export default CategoriasRoutes;