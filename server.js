var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ip = require('ip');
var file = "base.json";
var json;
console.log(ip.address());


app.use(express.static("."));
app.get('/', function (req, res) {
	res.redirect('index.html');
});
server.listen(3000);
io.on('connection', function (socket) {
	fs.readFile(file, 'utf8', function (err, data) {
		if (!err) {
			json = data;
		}
		else {
		}
	});
	setTimeout(() => {
		io.sockets.emit("delete", "all");
		json = JSON.parse(json);
		for (var i in json.p) {
			io.sockets.emit("new post", json.p[i]);
		}
	}, 200);


	socket.on("new post", function (data) {

		fs.readFile(file, 'utf8', function (err, data) {
			if (!err) {
				json = data;
			}
			else {
			}
		});
		setTimeout(function () {
			json = JSON.parse(json);
			json.p.push(data);
			json = JSON.stringify(json);
			fs.writeFile(file, json);
			io.sockets.emit("new post", data);
		}, 1000)
	})
});