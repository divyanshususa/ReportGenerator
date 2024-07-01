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

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

app.use(cors({
    origin: ["https://6682d072fef90d3e4e5d718d--report-generator-007.netlify.app","http://localhost:5173", "https://dapper-fairy-e8fc1b.netlify.app"],
    credentials: true
}));

app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.get("/", (req, res, next) => {
    res.send("server is running")
})
//routes
import userRouter from "../src/routes/user.routes.js"
import telecomRouter from "../src/routes/telecom.routes.js"
import medicalRouter from "../src/routes/medical.routes.js"

//route declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/telecom", telecomRouter)
app.use("/api/v1/medical", medicalRouter)



app.use(errorMiddleware); //custom error handler