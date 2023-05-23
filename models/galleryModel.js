
const mongoose = require("mongoose");

gallerySchema =  new mongoose.Schema({

       name:{
        type:String,
       required:true,
       },
       path:{
        type:String,
        required:true, 
       }
});

module.exports = mongoose.model('galeryImages',gallerySchema);