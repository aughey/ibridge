var common = require("./common");
var net = require('net');
var argv = require('optimist').argv;

var io = common.newServer(argv['p'] || 3001);

io.sockets.on('connection', function(socket) {
   console.log("Connection to server websocket");
	var c = null;
	socket.on('data',function(d) {
		if(d['c'] == 'x') {
			// Close request
			if(c) {
				c.destroy();
			}
		} else if(d['c'] == 'c') {
			// Connect request
			c = net.connect(22,'localhost', function() {
				c.on('data', function(d) {
					socket.emit('data',{c:'d', d: d.toString('binary')});
				})
				c.on('close', function() {
					socket.emit('data',{c: 'x'});
					c = null;
				})
			})
		} else if(d['c'] == 'd') {
			// Data to write to the socket.
			if(!c) {
				console.log("Attempted write to unconnected socket")
			} else {
				c.write(new Buffer(d['d'],'binary'));
			}
		}
	});
	socket.on('disconnect', function() {
		if(c) {
			c.dst
		}
	})
});
