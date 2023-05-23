const mongoose = require("mongoose");

   const eventSchema = new mongoose.Schema({
    eventName:{
       type:String,
       required:true
    },
    eventSubname:{
       type:String,
       required:true
    },
    eventTime:{
       type:String,
       required:true
    },
    eventdateStart:{
       type:Date,
       required:true
    },
    eventdateEnd:{
       type:Date,
       required:true
    },
    eventDiscription:{
       type:String,
       required:true
    },
    eventImage:{
       type:String,
       required:true
    },
    eventLocation:{
      type:String,
      required:true
    },
    eventId:{
        type:String,
        default:''
     },
    token:{
      type:String,
      default:''
    },

     },

     {timestamps:true}

     );
  module.exports = mongoose.model('allEvent',eventSchema);
