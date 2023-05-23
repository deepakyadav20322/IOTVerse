
const express = require("express");
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;



//connection of database....
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECTION,{
  useNewUrlParser: false,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});



//users Route.............
const userRoute = require("./Routes/userRoute");
app.use('/',userRoute);

//home Route.............
const homeRoute = require("./Routes/homeRoute");
app.use('/',homeRoute);

//admin Route.............
const adminRoute = require("./Routes/adminRoute");
app.use('/admin',adminRoute);

//event Route
const eventRoute = require('./Routes/eventsRoute');
app.use('/event',eventRoute);




app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port} `);
});