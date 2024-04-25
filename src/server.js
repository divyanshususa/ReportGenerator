import { app } from "./app.js"
import { connectDb } from "./db/connnection.js"


connectDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is running at port : ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("database connectionlk  failed with :", err)
})