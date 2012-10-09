var common = require("./common");
var net = require('net');
var argv = require('optimist');

var server = common.newServer(argv['p'] || 3001);

server.newEndpoint('open', function(open_data) {
    var c = net.connect(22, "localhost", function() {
      console.log("Connecting to local ssh server");

      function writeData(d) {
        c.write(new Buffer(d.d, 'binary'));
      }
      var ep = server.newEndpoint(null, writeData, function() {
        c.end();
      });

      c.on('data', function(d) {
        server.sendMessage({
          c: open_data.i,
          d: d.toString('binary')
        });
      })
      c.on('end', function() {
        ep.close();
      })
      // Let the remote side know this endpoint
      server.sendMessage({
        c: open_data.i,
        i: ep.id
      });
    })
  });

setInterval(function() {
  // Ping the other side.
  server.sendMessage({
    c: 'p'
  })
}, 1000);