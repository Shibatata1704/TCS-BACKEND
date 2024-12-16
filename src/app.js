import express from "express"
import routes from "./routes/index.js";
import cors from "cors"

const app = express()

const corsOptions = {
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    maxAge: 3600, // Cache por 1 hora
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

routes(app)

export default app;



