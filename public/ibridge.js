function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function status(message) {
	$('#status').append($("<li>").html(message));
}

function init(serveraddress) {
	var socket = io.connect();
	var serversocket = io.connect(serveraddress);
	socket.on('connect', function() {
		status("Connected to client");
		$('#clientconnected').addClass('greenstatus');
	})
	socket.on('disconnect', function() {
		status("Disconnected from server");
		$('#clientconnected').removeClass('greenstatus');
	})

	var servercount = 0;
	var clientcount = 0;
	var countdom = $('#count');
	var updateCount = function() {
			countdom.html("<div>Server bytes: " + numberWithCommas(servercount) + "<br />" + "Client bytes: " + numberWithCommas(clientcount) + "<br />" + "Total: " + numberWithCommas(servercount + clientcount) + "</div>")
		}
	updateCount = _.throttle(updateCount, 1000);
	serversocket.socket.on('connect', function() {
		status("Connected to server")
		$('#serverconnected').addClass('greenstatus');

	})
	serversocket.on('disconnect', function() {
		status("Disconnected from server");
		$('#serverconnected').removeClass('greenstatus');
	})
	socket.on('data', function(d) {
		if(d['d']) {
			clientcount += d.d.length;
			updateCount();
		}
		serversocket.emit('data', d);
	});
	serversocket.on('data', function(d) {
		if(d['d']) {
			servercount += d.d.length;
			updateCount();
		}
		socket.emit('data', d);
	})
	updateCount();
}
function getServerAddress() {
	$.get("/serveraddress",{},function(d) {
		init(d);
	})
}
$(getServerAddress);