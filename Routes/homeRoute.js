const express = require('express');
const home_Route = express();
const homeControler = require("../controlers/homeControler");


// middeleware for static files uses
home_Route.use(express.static('public'));

//set the view engine
home_Route.set('view engine','ejs');
home_Route.set('views','./views/home');

home_Route.get('/',homeControler.loadHome);
home_Route.get('/gallery',homeControler.loadGallery);
home_Route.get('/achivement',homeControler.achivement)





module.exports = home_Route;