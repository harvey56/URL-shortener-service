var http = require('http');
var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 3000;

//app.use(express.static(__dirname + '/views/index.ejs'));
app.set('views', './views');
app.set("view engine", "pug");

app.get("/", function(req, res){
    res.render('index', {apptitle: 'URL shortener service API', pagetitle: 'URL shortener service'});
}).listen(8080);