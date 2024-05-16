import mongoose from "mongoose";


const excelPassword = new mongoose.Schema({
    password: {
        type: String
    }
})

const ExcelPassword = mongoose.model("ExcelPassword", excelPassword)

export default ExcelPassword;