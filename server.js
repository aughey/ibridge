var common = require("./common");
var net = require('net');
var argv = require('optimist').argv;

var io = common.newServer(argv['p'] || 3001);

var id=0;
io.sockets.on('connection', function(socket) {
   var thisid = id;
   id += 1;
   console.log("Connection to server websocket " + thisid);
	var c = null;
	socket.on('data',function(d) {
		if(d['c'] == 'x') {
			// Close request
			if(c) {
            console.log("Closing connection " + thisid);
				c.destroy();
            c = null;
			}
		} else if(d['c'] == 'c') {
			// Connect request
         if(c) {
           console.log("Connect request with already connected socket " + thisid);
           return;
         }
         console.log("Connecting to ssh " + thisid);
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
				console.log("Attempted write to unconnected socket " + thisid)
			} else {
				c.write(new Buffer(d['d'],'binary'));
			}
		}
	});
	socket.on('disconnect', function() {
		if(c) {
			c.destroy();
		}
	})
});
