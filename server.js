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
	function start() {
		io.sockets.emit("delete", "all");
		json = JSON.parse(json);
		io.sockets.emit("users", [json.users, json.following, json.followers]);
		for (var i in json.p) {
			io.sockets.emit("new post", json.p[i]);
		}
	}
	setTimeout(function(){io.sockets.emit("signIn", json.singIn);},10);

	socket.on("start", start)
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
		}, 10)
	})
	socket.on("ip", function (data) {

		fs.readFile(file, 'utf8', function (err, data) {
			if (!err) {
				json = data;
			}
			else {
			}
		});
		setTimeout(function () {
			json = JSON.parse(json);
			json.signIn.push({ ip: data[0], user: data[1] });
			json = JSON.stringify(json);
			fs.writeFile(file, json);
		}, 10)
	})
});