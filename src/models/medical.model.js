import mongoose from "mongoose"
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { type: String, },
    rate: { type: String, },
    qty: { type: String, },
    productNo: { type: String, },
});

const medicalSchema = new Schema({
    "File No": { type: String, default: "" },
    "Ref No": { type: String, default: "" },
    "Con No": { type: String, default: "" },
    "Sales Date": { type: String, default: "" },
    "Sales Time": { type: String, default: "" },
    "mail Address": { type: String, default: "" },
    "City": { type: String, default: "" },
    "Customer Phone": { type: String, default: "" },
    "Record No": { type: String, default: "" },
    "Invoice No": { type: String, default: "" },
    "courier name": { type: String, default: "" },
    "Dispatch Date": { type: String, default: "" },
    "Dispatch By": { type: String, default: "" },
    "Agent Name": { type: String, default: "" },
    "State": { type: String, default: "" },
    "Credit card type": { type: String, default: "" },
    "Entry Date": { type: String, default: "" },
    "customer name": { type: String, default: "" },
    "Address": { type: String, default: "" },
    "zip": { type: String, default: "" },
    "credit card no": { type: String, default: "" },
    "Total": { type: String, default: "" },
    "discount": { type: String, default: "" },
    "netAmount": { type: String, default: "" },
    "amount in words": { type: String, default: "" },
    "remark": {
        type: String,
        enum: ["", "N.A.", "form details are not found", "field name is missing"],

    },
    "product": [productSchema]
}, {
    timestamps: true
});

const Medical = mongoose.model('Medical', medicalSchema);

export default Medical;
