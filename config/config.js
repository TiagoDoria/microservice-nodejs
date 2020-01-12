var express          = require('express');
 
var consign          = require('consign');
 
var bodyParser       = require('body-parser');
 
var app = express();
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
 
 consign().include("app/repository")
         .then("app/controllers")
         .into(app);
 
module.exports = app;