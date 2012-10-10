var common = require("./common");
var net = require('net');
var argv = require('optimist').boolean('o').argv;

var server = common.newServer(argv['p'] || 3001);
var openconnection = argv.o || false

if(openconnection) {
	console.log("Warning: running with openconnection.  Possibly problematic.")
}

server.newEndpoint('open', function(open_data) {
	var host = open_data['host'] || "localhost"
	var port = open_data['port'] || 22
	if(!openconnection) {
		host = 'localhost'
		port = 22;
	}
	var c = net.connect(port, host, function() {

		function writeData(d) {
			c.write(new Buffer(d.d, 'binary'));
		}
		var ep = server.newEndpoint(null, writeData, function() {
			c.end();
		});

		c.on('data', function(d) {
			server.sendMessage({
				c: open_data.i,
				s: ep.id,
				d: d.toString('binary')
			});
		})
		c.on('close', function() {
			server.sendMessage({
				c: 'x',
				i: open_data.i
			});
			ep.close();
		})
		// Let the remote side know this endpoint
		server.sendMessage({
			c: open_data.i,
			i: ep.id
		});
	})
	c.on('error',function(err) {
		console.log("Error with connection to " + host + ":" + port);
		console.log(err);
	})
});

setInterval(function() {
	// Ping the other side.
	server.sendMessage({
		c: 'p'
	})
}, 1000);