var querystring = require('querystring');
var http = require('http');

module.exports = {
	post: function(callback ,url, port, path, data) {
		var json_data = querystring.stringify(data);
		var options = {
			host: url,
			port: port,
			path: path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(json_data)
			}
		};

		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				callback(chunk)
			});
		});
		req.write(json_data);
		req.end();
	}
};