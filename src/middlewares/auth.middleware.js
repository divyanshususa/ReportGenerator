import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    console.log("cookies:", req.cookies)
    console.log("get token", token);

    if (!token) return next(new apiError(401, "user not logged in"));

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // to get user object
    console.log("decoded data :", decodedData._id)

    const user = await User.findById({ _id: decodedData._id });
    console.log("user is ", user)
    req.user = user
    // console.log(req.user)
    next(); // to call next middleware
});

export const authorizedAdmin = (req, res, next) => {
    console.log("user", req.user)
    if (req.user.role !== "admin")
        return next(new apiError(401, "user is not allowed to access this resource"));
    next();
};

export const requireAccessLevel = (requiredAccessLevel) => asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    // Find the user in the database
    const user = await User.findById(userId);

    // Check if the user exists and has the required access level
    if (!user || !user.accessLevel || user.accessLevel !== requiredAccessLevel) {
        return next(new apiError(401, "you are not allowed to access this resource"));
        // return res.status(403).json({ success: false, message: 'Insufficient access level' });
    }
    next();
})

