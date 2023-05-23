const events = require("../models/eventModel");

const eventLoad = async(req,res)=>{
     try {
        const allEvents = await events.find().sort({_id: -1});
        
         res.render("eventHome",{events :allEvents});

     } catch (error) {
        console.log(error.message);
     }
}

module.exports = {
    eventLoad,
}