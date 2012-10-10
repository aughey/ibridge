var common = require("./common");
var net = require('net');
var events = require('events');
var argv = require('optimist')['default']({
	p: 3000,
}).demand('s').describe('s', 'server address.  eg. http://server.slicehost.com:3001').describe('p','Local http server port').argv;

var server = common.newServer(argv['p'], [
	['/serveraddress', argv.s]
]);


// Handle the ping message
server.newEndpoint('p', function() {
});

var net = require('net'),
	socks = require('./socks.js');

function createRemoteConnection(port,address,proxy_ready) {
	var emitter = new events.EventEmitter;
	function handle_connect(connect_data) {
		returnobj.write = function(data) {
			server.sendMessage({
				c:connect_data.i,
				s: ep.id,
				d:data.toString('binary')});
		}
		returnobj.close = function() {
			//console.log("Asked to close endpoint id " + ep.id);
			server.sendMessage({c:'x', i:connect_data.i})
			ep.close();
		}
		returnobj.end = returnobj.close;

		function handle_data(d) {
			emitter.emit('data',new Buffer(d.d,'binary'));
		}
		//console.log("Connection to remote server established");
		ep.setCallback(handle_data);
		proxy_ready();
	}
	var ep = server.newEndpoint(null, handle_connect, function() {
		//console.log("endpoint asked to be closed");
		emitter.emit('close')
	});
	// Tell the remote side to create a connection
	var returnobj = {
		on: function() {
			emitter.on.apply(emitter,arguments);
		},
		removeAllListeners: function() {
			emitter.removeAllListeners.apply(emitter,arguments);
		},
		end: function() {
			ep.close();
		}
		
	}
	server.sendMessage({c:'open', i:ep.id, host: address, port: port})
	return returnobj;
}

// Create server
// The server accepts SOCKS connections. This particular server acts as a proxy.
var HOST = '127.0.0.1',
	PORT = '8888',
	socksserver = socks.createServer(function(socket, port, address, proxy_ready) {

		// Implement your own proxy here! Do encryption, tunnelling, whatever! Go flippin' mental!
		// I plan to tunnel everything including SSH over an HTTP tunnel. For now, though, here is the plain proxy:
		//console.log('Got through the first part of the SOCKS protocol.')
		//console.log("Connecting to " + address + ":" + port)
		//var proxy = net.createConnection(port, address, proxy_ready);
		var proxy = createRemoteConnection(port, address, proxy_ready);

		proxy.on('data', function(d) {
		//	try {
				//console.log('receiving ' + d.length + ' bytes from proxy');
				socket.write(d);
		//	} catch(err) {}
		});
		socket.on('data', function(d) {
			// If the application tries to send data before the proxy is ready, then that is it's own problem.
		//	try {
				//console.log('sending ' + d.length + ' bytes to proxy');
				proxy.write(d);
		//	} catch(err) {}
		});

		proxy.on('close', function(had_error) {
			socket.end();
			//console.error('The proxy closed');
		}.bind(this));
		socket.on('close', function(had_error) {
			proxy.removeAllListeners('data');
			proxy.end();
			//console.error('The application closed');
		}.bind(this));

	});

socksserver.on('error', function(e) {
	console.error('SERVER ERROR: %j', e);
	if(e.code == 'EADDRINUSE') {
		console.log('Address in use, retrying in 10 seconds...');
		setTimeout(function() {
			console.log('Reconnecting to %s:%s', HOST, PORT);
			server.close();
			server.listen(PORT, HOST);
		}, 10000);
	}
});
socksserver.listen(PORT, HOST);

// vim: set filetype=javascript syntax=javascript :