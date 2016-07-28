var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencode = bodyParser.urlencoded({ extended: false });
app.use(express.static('public'));


// redis
var redis = require('redis');
if (process.env.REDISTOGO_URL){
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
}else{
  var client = redis.createClient();
  client.select((process.env.NODE_ENV || 'development').length);
}

app.get('/cities', function(req,res){
  // get cities
  client.hkeys('cities', function(error, names){
    res.json(names);
  });
});

app.post('/cities', urlencode, function(req, res){
  // retrieve data from the form
  var newCity = req.body;

  if(!newCity.name || !newCity.description){
    res.sendStatus(400);
    return false;
  }
  // create data in db
  client.hset('cities', newCity.name, newCity.description, function(error){
    if(error) throw error;
    res.status(201).json(newCity.name);
  });
});

app.delete('/cities/:name', function(req,res){
  client.hdel('cities', req.params.name, function(error){
    if(error) throw error;
    res.sendStatus(204);
  })
})
module.exports = app;
