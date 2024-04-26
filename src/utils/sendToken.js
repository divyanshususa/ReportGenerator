import { apiResponse } from "./apiResponse.js";

const sendToken = (res, user, message, statusCode = 201) => {
    const token = user.getJWTToken();
    console.log("send token:", token)
    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        // sameSite: "none",
        sameSite: 'strict'
    };
    res.status(statusCode).cookie("token", token, options).json(new apiResponse(user, message, true));
};

export default sendToken;
