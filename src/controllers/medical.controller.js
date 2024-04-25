import Medical from "../models/medical.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller function to store data in the database
export const medicalInsertion = asyncHandler(async (req, res, next) => {
    const medicalData = req.body;

    // Create a new record instance using the Record model
    const record = await Medical.create(medicalData);
    const user = await User.findOne(req.user._id);


    if (!record) return next(new apiError("something wen't wrong while storing report details", 404))

    user.reportModel = "Medical";
    user.report.push(record._id);

    await user.save()


    res.status(201).json(
        new apiResponse("", "report saved successfully", true)
    );
})

export const getAReport = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    console.log("id:", id)
    // Create a new record instance using the Record model
    const record = await Medical.findOne({ _id: id });

    if (!record) return next(new apiError("report not found", 404))

    res.status(201).json(
        new apiResponse(record, "record fetched successfully", true)
    );
})

export const medicalUpdate = asyncHandler(async (req, res, next) => {
    const { id, data } = req.body
    console.log(data)

    // Create a new record instance using the Record model
    const record = await Medical.findByIdAndUpdate(id, data, { new: true });
    ;


    if (!record) return next(new apiError("something wen't wrong while storing report details", 404))



    res.status(200).json(
        new apiResponse("", "report updated successfully", true)
    );
})
export const medicalAdminUpdate = asyncHandler(async (req, res, next) => {
    const { id, data } = req.body
    // console.log(data)

    // Create a new record instance using the Record model
    const record = await Medical.findByIdAndUpdate(id, data, { new: true });
    ;


    if (!record) return next(new apiError("something wen't wrong while storing report details", 404))



    res.status(200).json(
        new apiResponse("", "report updated successfully", true)
    );
})
