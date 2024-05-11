import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendToken from "../utils/sendToken.js";
import { generateStrongPassword } from "../utils/generatePassword.js";
import apiError from "../utils/apiError.js";

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


export const getALLReports = asyncHandler(async (req, res, next) => {

    const { id } = req.params

    console.log("userid :", id)

    let user = await User.findOne({ _id: id }).populate("report")

    console.log("reports: ", user);

    res.status(200).json(new apiResponse(user.report, "report associate with this user in database", true))

});

export const getFilteredReport = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    console.log("userid :", id);
    console.log("startDate :", new Date(startDate));
    console.log("endDate :", endDate);

    let query = { user: id };
    // If startDate and endDate are provided, add them to the query
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };

        console.log(query.createdAt)
    }

    console.log(query)

    // match: { age: { $gte: 21 } },
    let user = await User.findOne({ _id: id }).populate({
        path: "report",
        match: { createdAt: query.createdAt }
    });

    console.log("reports: ", user);

    res.status(200).json(new apiResponse(user.report, "filtered Reports associated with this user in the database", true));

});

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

