import mongoose from "mongoose"
const Schema = mongoose.Schema;

const telecomSchema = new Schema({
    "File No": { type: String, default: "" },

    "Invoice date": { type: String, default: "" },

    "Device Name": { type: String, default: "" },

    "MMS": { type: String, default: "" },

    "customer type": { type: String, default: "" },

    "company name": { type: String, default: "" },

    "city": { type: String, default: "" },

    "residence type": { type: String, default: "" },

    "balance": { type: String, default: "" },

    "card expiry date": { type: String, default: "" },

    "Record No": { type: String, default: "" },

    "phone No": { type: String, default: "" },

    "phone cost": { type: String, default: "" },

    "texts": { type: String, default: "" },

    "cust name": { type: String, default: "" },

    "cust address": { type: String, default: "" },

    "state": { type: String, default: "" },

    "agent no": { type: String, default: "" },

    "agency name": { type: String, default: "" },

    "Credit card type": { type: String, default: "" },

    "Credit rate": { type: String, default: "" },

    "invoice no": { type: String, default: "" },

    "price plans": { type: String, default: "" },

    "monthly cost": { type: String, default: "" },

    "extra value included": { type: String, default: "" },


    "email": { type: String, default: "" },

    "zip": { type: String, default: "" },

    "agent name": { type: String, default: "" },

    "deposit": { type: String, default: "" },

    "credit card no": { type: String, default: "" },

    "remark": { type: String, default: "" },

    "initials": { type: String, default: "" },

    "agency code": { type: String, default: "" },

}, {
    timestamps: true
});

const Telecom = mongoose.model('Telecom', telecomSchema);

export default Telecom;
