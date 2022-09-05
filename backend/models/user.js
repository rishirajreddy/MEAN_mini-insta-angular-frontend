const mongoose = require('mongoose');

const user = mongoose.Schema({
    username: {
        type:String,
        unique:true,
        required:true
    },
    email: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    profile: {
        type: Object
    }
})

module.exports = mongoose.model('user',user);



