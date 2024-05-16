import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendToken from "../utils/sendToken.js";
import { generateStrongPassword } from "../utils/generatePassword.js";
import apiError from "../utils/apiError.js";
import ExcelJs from "exceljs"
import XlsxPopulate from "xlsx-populate";
import fs from "fs"
import path from 'path';

import Medical from "../models/medical.model.js";
import Telecom from "../models/telecom.model.js";
import ExcelPassword from "../models/excelPassword.model.js";
import { fileURLToPath } from "url";


export const register = asyncHandler(async (req, res, next) => {

    const { name, email } = req.body

    if ([name, email].some((field) => field?.trim() === "")) {
        return next(new apiError("all fields are required", 400))
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        return next(new apiError("user already exists", 404))
    }

    const user = await User.create({
        name, email
    })

    const createdUser = await User.findOne(user._id).select("-password -refreshToken");

    if (!createdUser) return next(new apiError("something went wrong while registering user", 404))

    res.status(201).json(
        new apiResponse(createdUser, "contact admin for your credential", true)
    )
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) return next(new apiError("all fields are required", 404))

    const user = await User.findOne({ email })
    console.log(user)

    if (!user) return next(new apiError("user not found", 404))

    const isCorrect = await user.comparePassword(password);
    console.log(isCorrect)
    if (!isCorrect) {
        return next(new apiError("either email or password is incorrect", 404))
    }

    if (user.deniedAccess === "yes") return next(new apiError("service suspended for now", 404))

    sendToken(res, user, `welcome ${user.name}`, 200)
});

//admin
export const setPasswordAndLevel = asyncHandler(async (req, res, next) => {
    const { userId, level } = req.body
    console.log(userId)

    if (!userId || !level) return next(new apiError("all fields are required", 404))

    let user = await User.findOne({ _id: userId })

    if (!user) return next(new apiError("user not found", 404))

    user.password = generateStrongPassword(10);
    user.accessLevel = level;

    await user.save();

    res.status(201).json(new apiResponse(user, "password saved successfully", true))


});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.body
    const user = await User.findOne({ _id: id })

    user.password = generateStrongPassword(10);

    await user.save()
    res.status(201).json(new apiResponse("", "password reset successfully", true))

})

export const getAllUsers = asyncHandler(async (req, res, next) => {

    let users = await User.find({ role: "user" })

    res.status(200).json(new apiResponse(users, "all users in database", true))


});
export const getAUser = asyncHandler(async (req, res, next) => {

    const { id } = req.params
    console.log(id)
    let user = await User.find({ _id: id }).populate("report")

    res.status(200).json(new apiResponse(user, "all users in database", true))

});
export const deleteUser = asyncHandler(async (req, res, next) => {

    const { id } = req.params
    console.log(id)
    await User.findByIdAndDelete({ _id: id })

    res.status(200).json(new apiResponse("", "user Deleted successfully", true))

});


export const deleteReport = asyncHandler(async (req, res, next) => {

    const { id } = req.params

    console.log("report id :", id)

    let user = await User.findOne({ _id: req.user._id }).populate("report")
    console.log(user.report)
    const reports = user.report?.filter(report => report._id !== id);

    if (user.accessLevel === "medical") {
        const res = await Medical.deleteOne({ _id: id });
        console.log(res)
    }
    else if (user.accessLevel === "telecom") {
        const res = await Telecom.deleteOne({ _id: id });
        console.log(res)
    }

    user.report = reports;

    await user.save()

    console.log("reports: ", user);

    res.status(200).json(new apiResponse('', "report deleted successfully", true))

});
export const getALLReports = asyncHandler(async (req, res, next) => {

    const { id } = req.params

    console.log("userid :", id)

    let user = await User.findOne({ _id: id }).populate("report")

    console.log("reports: ", user);

    res.status(200).json(new apiResponse(user.report, "report associate with this user ", true))

});

export const getFilteredReport = asyncHandler(async (req, res, next) => {


    const { id } = req.params;
    const { startDate, endDate } = req.body;
    const filePassword = await ExcelPassword.findOne({ _id: "6645af8f5ea36215b743c22f" })
    const filePath = path.join(process.cwd(), 'src', 'excel-files', 'protected.xlsx');
    // Log received parameters
    console.log("UserID:", id);
    console.log("StartDate:", startDate);
    console.log("EndDate:", endDate);

    // Convert dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date conversion
    // if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    //     return res.status(400).json({ message: "Invalid date format" });
    // }

    console.log("Converted StartDate:", start);
    console.log("Converted EndDate:", end);
    end.setDate(end.getDate() + 1);
    console.log("after append", end);
    // Build query object
    let query = { user: id };
    if (startDate && endDate) {
        query.createdAt = {
            $gte: start,
            $lte: end
        };
    }

    console.log("Query:", query);

    // Fetch user and filter reports based on the createdAt field
    let user = await User.findOne({ _id: id }).populate({
        path: "report",
        match: { createdAt: query.createdAt }
    });

    // Check if user is found
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // console.log("Filtered Reports:", user.report);

    const { report: reportData } = user;
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    if (reportData.length > 0) {
        const data = reportData.map(item => {
            const productsString = item?.product?.map(product => `${product.productName}: ${product.rate} (${product.qty})`).join(', ');
            const values = Object.values(item);
            values[values?.indexOf(item.product)] = productsString;
            const [, , res] = values; // Adjust according to your schema
            return res;
        });

        const valueToInserted = data.map(item => Object.values(item));
        const headers = Object.keys(data[0]);
        valueToInserted.unshift(headers);

        console.log("Value to be inserted:", valueToInserted);

        valueToInserted.forEach(row => {
            worksheet.addRow(row);
        });

        // const filePath = path.join(__dirname, '..', 'excel-files', 'rangeReport.xlsx');
        await workbook.xlsx.writeFile(filePath);

        const populatedWorkbook = await XlsxPopulate.fromFileAsync(filePath);
        await populatedWorkbook.toFileAsync(filePath, { password: filePassword.password });

        res.download(filePath, 'rangeReport.xlsx', () => {
            fs.unlinkSync(filePath);
        });
    }

    else {
        res.status(200).json(new apiResponse("", "haven't generated reports till now", true))
    }

});


// export const getTodaysReport = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;

//     // Get today's date
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

//     // Define the query to filter reports for today
//     const query = {
//         user: id,
//         createdAt: {
//             $gte: today,
//             $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Next day
//         }
//     };

//     // Find the user by ID and populate the reports for today
//     const user = await User.findOne({ _id: id }).populate({
//         path: 'report',
//         match: { createdAt: query.createdAt }
//     });

//     if (!user) {
//         return res.status(404).json(new apiResponse(null, 'User not found', false));
//     }

//     res.status(200).json(new apiResponse(user.report, 'Reports for today associated with this user in the database', true));

// })


//excel with password protection
export const setExcelPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;

    const filePassword = await ExcelPassword.findOne({ _id: "6645af8f5ea36215b743c22f" });

    filePassword.password = password;

    await filePassword.save();

    res.status(200).json(new apiResponse("", "password set for file", true))
})

export const protectedExcel = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    console.log(dirname)
    const filePath = path.join(dirname, '..', 'excel-files', 'protected.xlsx');
    console.log("File path:", filePath);
    console.log(filePath)
    const filePassword = await ExcelPassword.findOne({ _id: "6645af8f5ea36215b743c22f" })

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    // Define the query to filter reports for today
    const query = {
        user: id,
        createdAt: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Next day
        }
    };

    // Find the user by ID and populate the reports for today
    const user = await User.findOne({ _id: id }).populate({
        path: 'report',
        match: { createdAt: query.createdAt }
    });

    // const user = await User.findById({ _id: id }).populate({ path: "report" })

    const { report: reportData } = user;
    console.log(reportData.length)

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    if (reportData.length > 0) {
        const data = reportData?.map(item => {
            // Extract values from each object
            const productsString = item?.product?.map(product => `${product.productName}: ${product.rate} (${product.qty})`).join(', ');

            const values = Object?.values(item);
            // Replace the 'product' property with the stringified products
            values[values?.indexOf(item.product)] = productsString;
            const [InternalCache, f, res] = values;
            // console.log(res)
            return res;
        });

        console.log("data", data)

        const valueToInserted = data.map(item => Object.values(item))
        const headers = Object.keys(data[0]);
        valueToInserted.unshift(headers);
        console.log("valueToInserted", valueToInserted);

        // console.log("data", data)

        //file is created 
        valueToInserted.forEach(row => {
            worksheet.addRow(row)
        });

        // console.log(worksheet)
        // console.log(workbook)
        // const filePath = path.join(__dirname, '..', 'excel-files', 'protected.xlsx'); // Specify the directory where you want to save the file
        await workbook.xlsx.writeFile(filePath);

        const populatedWorkbook = await XlsxPopulate.fromFileAsync(filePath);
        // await workbook.xlsx.writeFile(filePath, { password: password });
        await populatedWorkbook.toFileAsync(filePath, { password: filePassword.password });
        res.download(filePath, 'protected.xlsx', () => {
            fs.unlinkSync(filePath); // Delete the file after sending it to the client
        });
    }
    else {
        res.status(200).json(new apiResponse("", "haven't generated any report today", true))
    }

})

export const denyAcsess = asyncHandler(async (req, res, next) => {

    const { id } = req.body

    console.log("userid :", id)

    let user = await User.findOne({ _id: id })

    user.deniedAccess = "yes"

    await user.save()

    res.status(200).json(new apiResponse("", `${user.name} won't be able to login now`, true))

});
export const grantAcsess = asyncHandler(async (req, res, next) => {

    const { id } = req.body

    console.log("userid :", id)

    let user = await User.findOne({ _id: id })

    user.deniedAccess = "no"

    await user.save()

    res.status(200).json(new apiResponse("", `${user.name} will be able to login now`, true))

});

