import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"

import errorMiddleware from "./middlewares/error.middleware.js"


dotenv.config()

export const app = express()

app.use(morgan("combined"))

app.use(helmet());

app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))


//routes
import userRouter from "../src/routes/user.routes.js"
import telecomRouter from "../src/routes/telecom.routes.js"
import medicalRouter from "../src/routes/medical.routes.js"

//route declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/telecom", telecomRouter)
app.use("/api/v1/medical", medicalRouter)



app.use(errorMiddleware); //custom error handler