var express = module.require('express');
var app = express();
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var cmd = require('node-cmd');
var FormData = require('form-data');

app.use(bodyParser.json());


var users = [{'user': 'a', 'email': 'default@nes.com',  'pass': 'a'}];
var data = [{ 'name': 'a', 'data' : [{
    'id': 0,
    'name': 'Light control',
    'button': 'Switch light',
    'state': true
    },{
    'id': 1,
    'name': 'Vent control',
    'button': 'Switch vent',
    'state': false,
    }, {
    'id': 2,
    'name':'Pet feeder',
    'button':'Open/close',
    'state': false,
    }
]}];
var listOfURLs = [{
    'id': 0,
    'url': '192.168.102.117',
}];
var temp = 0;
var ledState = true;
var ventState = false;

app.listen(8000, function(req, res){
    console.log("Listening on 8000");
});

app.post('/do', function(req, res){
    console.log(req.body);
    var body = req.body;
    var datap = data[0].data[req.body.id];
    console.log(datap)
    if(datap != null){
        datap.state = body.state;
    }
    console.log(datap)
    console.log(data[0].data[1])
    data[0].data[req.body.id] = datap;
    console.log(data);
    //handleChangeState({state: req.body.state});
    res.status(200).json({status: true, data: data[0].data});
});

app.post('/auth', function(req, res){
    var status = 401;
    console.log(req);
    var response = { status: false };
    var user = verifyLogin(req.body.user, req.body.pass);
    if(user){
        response.status = true;
        status = 200;
    }
    res.status(status).json(response);
});

app.post('/items', function(req, res){
    var i = find(req.body.name);
    var status = 404;
    var datap = {data: []};
    console.log(req);
    if(i!==-1){
        status = 200;
        datap.data = data[i].data;
    }
    res.status(status).json(datap);
})

app.post('/register', function(req, res){
    var status = 400;
    var response =  { status: false };
    var user = { user: req.body.user, email: req.body.email, pass: req.body.pass};
    if(!userExists(req.body.email, req.body.user)){
        status = 200;
        response.status = true;
        users.push(user);
        data.push({name: user.user, data: []});
    }
    else response.message = "Email or user exists";
    res.status(status).json(response);
});

app.post('/add', function(req, res) {
    var i = find(req.body.name);
    var status = 400;
    var response = {message: "Not", status: false};
    if(i!==-1){
        data[i].data.push({'id': data[i].data.length, 'name': req.body.item, 'button': req.body.action});
        status = 200;
        response.message = "Successfully";
        response.status = true;
    }
    res.status(status).json(response);
});

app.post('/tempe', function(req, res){
	console.log(req.body);
	temp = req.body.temperature;
	res.status(200).json({status: true});
});
app.post('/temp', function(req, res){
	console.log(temp);	
	var response = {"temp": 0, "status" : true};
	var status = 200;
	response.temp = temp;
	res.status(200).json(response);
})

app.post('/led', function(req, res){
    var datap = data[0]
    ledState = datap.data[0].state;
    var body = ledState?"ON": "OFF";
    res.status(200).json({"LED": body});
});

app.post('/hranilica', function(req, res){
    var datap = data[0]
    hranilicaState = datap.data[2].state;
    var body = hranilicaState?"ON": "OFF";
    res.status(200).json({"LED": body});
})

app.post('/vent', function(req, res){
    var datap = data[0];
    console.log(datap)
    ventState = datap.data[1].state;
    var body = ventState?"ON": "OFF";
    res.status(200).json({"LED": body});
});


/*cmd.get('sudo node readTemp.js',
	function(err, data, stderr){
	console.log(data);
});*/
//////////////////////////////////////////////////////////////

function verifyLogin(user, pass){
    for(var i=0; i<users.length; i++){
        if(users[i].user == user && users[i].pass == pass){
            return true;
        }
    }
    return false;
}

function userExists(email, user) {
    for(var i = 0; i<users.length; i++){
        if(users[i].email === email || users[i].user === user) return true;
    }
    return false;
}

function find(name){
    for(var i = 0; i<data.length; i++){
        if(data[i].name === name) return i;
    }
    return -1;
}

function handleChangeState(x, data){
    var url = getUrl(x);
    if(url.id === 0){
        ledState = data.state;
    }
    else if(url.id === 1){
        fanState = data.state;
    }
}

function getUrl(id){
    for(var i in listOfURLs){
        if(listOfURLs[i].id === id) return listOfURLs[i];
    }
    return null;
}

function getId(id){
    var datap = data[0];
    for(var i in data){
        if(datap.data[i].id === id) return datap.data[i];
    }
    return null;
}

/*
(function () {
    fetch('http://localhost:6000/listen', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'a': 1})
        }).then(function(res) {
            return res.json();
        }).then(function(json) {
            console.log(json);
        })})();*/
