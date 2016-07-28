var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencode = bodyParser.urlencoded({ extended: false });
app.use(express.static('public'));

// use refis npm
var redis = require('redis');
var client = redis.createClient();

client.select((process.env.NODE_ENV || 'development').length);
// create starting data
// client.hset('cities', 'Lotopia', 'description');
// client.hset('cities', 'Caspiana', 'description');
// client.hset('cities', 'Indigo', 'description');

app.get('/cities', function(req,res){
  // get cities
  client.hkeys('cities', function(error, names){
    res.json(names);
  });
});

app.post('/cities', urlencode, function(req, res){
  // retrieve data from the form
  var newCity = req.body;
  // create data in db
  client.hset('cities', newCity.name, newCity.description, function(error){
    if(error) throw error;
    res.status(201).json(newCity.name);
  });
});

module.exports = app;
