var express = require('express');
var myParser = require("body-parser");
var app = express();

app.use(myParser.urlencoded({ extended: false }));
app.use(myParser.json());
app.post("/webhook", function(request, response) {
      console.log(request.body); //This prints the JSON document received (if it is a JSON document)
      response.end();
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})