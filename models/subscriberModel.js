const mongoose = require('mongoose');

const subscriberSchema  =new mongoose.Schema({
    Email:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('IOT_subscriber',subscriberSchema);