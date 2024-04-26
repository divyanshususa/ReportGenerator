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

app.use(cors({
    origin: ["http://localhost:5173","https://data-entry-8fa59.web.app"],
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