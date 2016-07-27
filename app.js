var express = require('express');
var app = express();

app.use('/', function(req,res){
  res.send('ok');
});

app.listen(3000, function(){
  console.log('Server listen in port 3000');
});
