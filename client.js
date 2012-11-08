var common = require("./common");
var net = require('net');
var argv = require('optimist')['default']({p:3000,e:null}).demand('s').describe('e','command to run when tunnel is active.  eg.  "ssh -N localhost -D 11111 -p 12345"').describe('s','Remote server url').argv;

var io = common.newServer(argv['p'],[['/serveraddress',argv.s]]);

var handle_connect = function(socket) {
	console.log("Connection to websocket");
	// Only one connection allowed.
	io.sockets.removeListener('connection',handle_connect);
	var connection = null;
	var netserver = net.createServer();
	netserver.on('connection',function(c) {
		connection = c;
		netserver.close();
		console.log("Connection to netserver client");
		socket.emit('data', {c: 'c'});
		c.on('data', function(d) {
			if(d && d.length > 0) {
				socket.emit('data', {c:'d',d: d.toString('binary')});
			}		
		});
		var handle_socket_data = function(d) {
			if(d['c'] == 'd') {
				c.write(new Buffer(d['d'],'binary'));
			} else if(d['c'] == 'x') {
				c.destroy();
			}			
		}
		c.on('end', function() {
			// Tell the remote side to close.
			socket.emit('data',{c:'x'});
			socket.removeListener('data',handle_socket_data);
			connection = null;
			netserver.listen(12345, '127.0.0.1');
		});
		socket.on('data',handle_socket_data);
	});
	netserver.listen(12345, '127.0.0.1');

	socket.on('disconnect',function() {
		console.log("Disconnected from websocket");
		if(connection) {
			connection.destroy();
		}
		netserver.close();
		netserver = null;
		io.sockets.on('connection',handle_connect);
	})
}

io.sockets.on('connection', handle_connect);

if(false) {

// Example tunnel_command: 'ssh -N localhost -D 11111 -p 12345'
var tunnel_command = argv['e']

var tunnel_connected = false;
var last_ping = 0;
function check_ping() {
	last_ping = Date.now();
	if(tunnel_connected) {
		return;
	}
	tunnel_connected = true;
	if(!tunnel_command) {
		console.log("Remote connection detected.  Remote host can be accessed");
		console.log("through ssh port 12345.");
		console.log("Example: -e 'ssh -N localhost -D 11111 -p 12345'");
		console.log("This command can be run automatically using the -e option.");
		return;
	}
	var cp = require('child_process');
	console.log("Establishing ssh tunnel to server")
	var child = cp.exec(tunnel_command)
	var interval_id = setInterval(function() {
		if(Date.now() - last_ping > 10 * 1000) {
			console.log("Disconnected for > 10 seconds, shutting down tunnel");
			tunnel_connected = false;
			child.kill();
			clearInterval(interval_id);
		}
	},1000)
}

// Handle the ping message
//server.newGlobalEndpoint('p',function() {
//	check_ping();
//});

var netserver = net.createServer(function(c) {
	console.log("Connection to client");
	function handle_connect(connect_data) {
		c.on('data', function(d) {
			if(d && d.length > 0) {
				server.sendMessage({c:connect_data.i,d:d.toString('binary')});
			}		
		})
		c.on('end', function() {
			// Tell the remote side to get rid of this connection.
			server.sendMessage({c:'x',i: connect_data.i});
			ep.close();
		});

		function handle_data(d) {
			c.write(new Buffer(d.d,'binary'));
		}
		console.log("Connection to remote server established");
		ep.setCallback(handle_data);
	}
	var ep = server.newEndpoint(null, handle_connect, function() {
		c.close();
	});
	// Tell the remote side to create a connection
	server.sendMessage({c:'open', i:ep.id})
});

netserver.listen(12345, '127.0.0.1');
}
