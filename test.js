var express = module.require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


app.listen(6000, function(req, res){
    console.log("Listening on 6000");
});

app.post('/listen', function(req, res){
    console.log(req);
    res.status(200).json({status: true});
});