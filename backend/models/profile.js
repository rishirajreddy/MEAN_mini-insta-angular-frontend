const mongoose = require("mongoose");

const profile = mongoose.Schema({
    username:{
        type: String
    },
    dp: {
        type: String,
        required: true
    },
    email: {
        type:String,
    },
    name:{
        type: String,
        required: true
    },
    bio:{
        type:String,
        required: true
    }
}
)
module.exports = mongoose.model("profile",profile);