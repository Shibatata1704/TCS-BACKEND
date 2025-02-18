import "dotenv/config";
import app from "./src/app.js";

const PORT = 22222;

app.listen(PORT, () => {
    console.log("Servidor escutando!");
});