const mongoose = require("mongoose");

   const userSchema = new mongoose.Schema({
    fname:{
       type:String,
       required:true
    },
    lastname:{
       type:String,
       required:true
    },
    email:{
       type:String,
       required:true
    },
    mobile:{
       type:Number,
       required:true
    },
    image:{
       type:String,
       required:true
    },
    password:{
       type:String,
       required:true
    },
    gender:{
      type:String,
      required:true
    },
    DOB:{
      type:Date,
      required:true
    },
    is_admin:{
       type:Number,
       required:true
    },
    is_varified:{
       type:Number,
       default:0
    },
    token:{
      type:String,
      default:''
    }

     },

     {timestamps:true}
     );
  module.exports = mongoose.model('allUser',userSchema);
