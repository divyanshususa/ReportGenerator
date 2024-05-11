import mongoose from "mongoose"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            lowecase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
        accessLevel: {
            type: String,
            enum: ["telecom", "medical", "both"],
        },
        report: [{
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'reportModel'
        }],
        reportModel: {
            type: String,
            enum: ["Telecom", "Medical"]
        },

        password: {
            type: String,
        },
        deniedAccess: {
            type: String,
            enum: ["no", "yes"],
            default: "no"
        }
    },
    {
        timestamps: true
    }
)



userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

userSchema.methods.comparePassword = async function (password) {
    return await password === this.password;
};


export const User = mongoose.model("User", userSchema)