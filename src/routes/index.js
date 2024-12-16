import login from "./loginRoute.js";
import logout from "./logoutRoute.js";
import usuarios from "./usersRoutes.js"
import categorias from "./categoriasRoutes.js"

const routes = (app) => {
    app.route("/").get((req,res) => res.status(200).send("Curso de Node,js"));

    app.use("/usuarios", usuarios)   
    app.use("/login", login) 
    app.use("/logout", logout)
    app.use("/categorias", categorias) 
}

export default routes;