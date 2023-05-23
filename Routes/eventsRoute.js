const express = require('express');
event_Route = express();

const eventControler = require("../controlers/eventControler");



// middeleware for static files uses
event_Route.use(express.static('public'));

// set the ejs tamplate
event_Route.set('view engine','ejs');
event_Route.set('views','./views/events');

event_Route.get('/',eventControler.eventLoad);


module.exports = event_Route;