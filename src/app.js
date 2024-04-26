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

const allowedOrigins = ['http://localhost:5173', 'https://master--jocular-croquembouche-38a4a9.netlify.app'];

// Enable CORS with specific origins
app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the allowed origins list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Enable sending cookies in cross-origin requests
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