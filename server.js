var http = require('http');
var express = require('express');
var path = require('path');
var url = require('url');
var app = express();
var mongodb = require("mongodb");
var mongoose = require('mongoose');

var urlDb = 'mongodb://harvey:url-shortener@ds133428.mlab.com:33428/url-shortener-service';
var port = process.env.PORT || 3000;
var output = {};
var URLregexp = /([http://|https://])(www)*.+(.)(net|com|org)\/*(.*)/g;

//app.use(express.static(__dirname + '/views/index.ejs'));

//function to generate a random 4 digits number
var rd = function(){
    var min = 1;
    var max = 10000;
    var rd = Math.floor(Math.random() * (max - min) + min);
    return rd;
};

//function to check if url path is a 4 digits number
var urlPath = function(rd){
    return (!isNaN(rd*1) ? true : false);
};
// without this line, mongoose sends an error message saying that mpromise (mongoose's default promise library) is deprecated - http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

mongoose.connect(urlDb);
var short = mongoose.model('short', {original_url: String, short_url: String});


// I'm using PUG as the view engine
app.set('views', './views');
app.set("view engine", "pug");

app.get("/", function(req, res, next){
    res.render('index', {apptitle: 'URL shortener service API', pagetitle: 'URL shortener service'});
    next();
});

app.use("/", function(req, res){
    req = req.originalUrl.slice(1);
    if (URLregexp.test(req)){
        console.log("you entered a long url");
        var urlToShorten = req;
        output.original_url = urlToShorten;
        output.short_url = "https://url-shortener-service-56.herokuapp.com/" + rd();
    
        output = new short({original_url: output.original_url, short_url: output.short_url});
        output.save(function(err){
            if (err)
                console.log(err);
                
            else
                console.log("URL has been shortened and saved to the database as follows : ", output);
                res.send(output);
        });
    }
    
    else if (urlPath(req) && req.length > 0){
        console.log("you entered a shortened url");
        var short_url = req;
        short.find({short_url: "https://url-shortener-service-56.herokuapp.com/" + short_url}, function(err, userObj){
            if (err)
                console.log(err);
            
            else if (userObj.length === 0)
                console.log("no such entry found in the database");
                
            else{
                console.log('found an entry in the database for this shortened url', userObj);
                res.redirect(userObj[0].original_url);
            }
        });
    }
    
    else{
        console.log("neither a short nor a long url. oops");
    }
    
});

app.listen(8080);