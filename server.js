var memory = require('./memory.js');
var communication = require('./communication.js');

var express = require('express');
var myParser = require("body-parser");
var app = express();

//Port as input parameter
var port = 8081;
if (process.argv.length > 2) {
	port = process.argv[2];
}

//Host_url as input parameter
var host_url = "http://localhost";
if (process.argv.length > 3) {
	host_url = process.argv[3];
}

//Host_port as input parameter
var host_port = 1234;
if (process.argv.length > 4) {
	host_port = process.argv[4];
}

//Use Json parser
app.use(myParser.urlencoded({
	extended: false
}));
app.use(myParser.json());

//Webhook for Alquist dialogue manager
app.post("/webhook", function(request, response) {
	memory.save_to_memory(request.body.session_id, request.body.text);
	response.end();
});

//Method for starting the session
app.post("/start", function(request, response) {
	communication.post(function(result) {
		json = JSON.parse(result);
		response.json(json);
	}, host_url, host_port, "/start", request.body);
});

//Method for sending messages to Alquist dialogue manager
app.post("/", function(request, response) {
	communication.post(function(result) {
		console.log(result);
		json = JSON.parse(result);
		response.json(json);
	}, host_url, host_port, "/", request.body);
});

//Method for asking last session message
app.post("/session", function(request, response) {
	response.json({
		"session_id": request.body.session_id,
		"text": memory.load_from_memory(request.body.session_id)
	});
});

//Start the server
var server = app.listen(port, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log("Alquist client listening at http://%s:%s", host, port);

})