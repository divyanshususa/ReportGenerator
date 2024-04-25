import mongoose from "mongoose"
const Schema = mongoose.Schema;

const telecomSchema = new Schema({
    "File No": { type: String, },

    "Invoice date": { type: String, },

    "Device Name": { type: String, },

    "MMS": { type: String, },

    "customer type": { type: String, },

    "company name": { type: String, },

    "city": { type: String, },

    "residence type": { type: String, },

    "balance": { type: String, },

    "card expiry date": { type: String, },

    "Record No": { type: String, },

    "phone No": { type: String, },

    "phone cost": { type: String, },

    "texts": { type: String, },

    "cust name": { type: String, },

    "cust address": { type: String, },

    "state": { type: String, },

    "agent no": { type: String, },

    "agency name": { type: String, },

    "Credit card type": { type: String, },

    "Credit rate": { type: String, },

    "invoice no": { type: String, },

    "price plans": { type: String, },

    "monthly cost": { type: String, },

    "extra value included": { type: String, },


    "email": { type: String, },

    "zip": { type: String, },

    "agent name": { type: String, },

    "deposit": { type: String, },

    "credit card no": { type: String, },

    "remark": { type: String, },

    "initials": { type: String, },

    "agency code": { type: String, },

});

const Telecom = mongoose.model('Telecom', telecomSchema);

export default Telecom;
