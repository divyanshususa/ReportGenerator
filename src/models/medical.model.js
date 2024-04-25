import mongoose from "mongoose"
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { type: String, },
    rate: { type: String, },
    qty: { type: String, },
    productNo: { type: String, },
});

const medicalSchema = new Schema({
    "File No": { type: String, },
    "Ref No": { type: String, },
    "Con No": { type: String, },
    "Sales Date": { type: String, },
    "Sales Time": { type: String, },
    "mail Address": { type: String, },
    "City": { type: String, },
    "Customer Phone": { type: String, },
    "Record No": { type: String, },
    "Invoice No": { type: String, },
    "courier name": { type: String, },
    "Dispatch Date": { type: String, },
    "Dispatch By": { type: String, },
    "Agent Name": { type: String, },
    "State": { type: String, },
    "Credit card type": { type: String, },
    "Entry Date": { type: String, },
    "customer name": { type: String, },
    "Address": { type: String, },
    "zip": { type: String, },
    "credit card no": { type: String, },
    "Total": { type: String, },
    "discount": { type: String, },
    "netAmount": { type: String, },
    "amount in words": { type: String, },
    "remark": {
        type: String,
        enum: ["","NA", "form details are not found", "field name is missing"],

    },
    "product": [productSchema]
});

const Medical = mongoose.model('Medical', medicalSchema);

export default Medical;
