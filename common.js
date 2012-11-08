var events = require('events')
var _ = require("./public/lib/underscore-min.js");

exports.newServer = function(port,static) {
  static = static || [];
  var URL=require('url');

  function handler(req,res) {
    var url = URL.parse(req.url);
    if(url.pathname == '/') {
      url.pathname = "/index.html";
    }
    for(var i=0;i<static.length;i++) {
      var s = static[i];
      if(s[0] == url.pathname) {
        res.writeHead(200);
        res.end(s[1]);
        return;
      }
    }
    var fullpath = __dirname + "/public" + url.pathname
    fs.readFile(fullpath, function(err, data) {
      if(err) {
        res.writeHead(500);
        return res.end('Error serving ' + fullpath);
      }
      res.writeHead(200);
      res.end(data);
    });
  }

  console.log("Listening on port " + port)

  var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

  app.listen(port);

  io.set('log level', 2);

  return io;

  var endpointindex = 0;

  function createEndpoints(socket) {
    var emitter = new events.EventEmitter;

    // Handle data on this socket
    socket.on('data', function(data) {
      var handler = endpoints[data['c']];
      if(!handler) {
        if(data['s']) {
          // Tell that remote connection to disconnect
          endpoints.sendMessage({c: 'x', i: data['s']})
        }
      } else {
        handler[0](data);
      }
    });

    // Handle the disconnect message
    socket.on('disconnect', function() {
      for(var key in endpoints) {
        var ep = endpoints[key];
        if(ep[1]) {
          ep[1];
        }
      }
      endpoints = {}
      emitter.emit('end');
      emitter.removeAllListeners();
    });

    var endpoints = {}

    function newEndpoint(id, callback, shutdown) {
      var thisindex = id;
      if(!thisindex) {
        thisindex = endpointindex;
        endpointindex += 1;
      }
      endpoints[thisindex] = [callback, shutdown];
      return {
        setCallback: function(cb) {
          endpoints[thisindex][0] = cb;
        },
        close: function() {
          delete endpoints[thisindex]
        },
        sendMessage: function(msg) {
          socket.emit('data',msg);
        },
        id: thisindex

      }
    }

    // Create a handler for remote closing
    newEndpoint('x', function(d) {
      var ep = endpoints[d.i];
      if(ep) {
        if(ep[1])
          ep[1]();
        delete endpoints[d.i];
      }
    });

    // Add the global endpoints
    for(var ep in global_endpoints) {
      newEndPoint(ep[0],ep[1]);
    }

    return {
      newEndpoint: function(id, calllback, shutdown) {
        newEndpoint(id,callback,shutdown);
      },
      sendMessage: function(msg) {
        socket.emit('data',msg);
      },
      emitter: emitter
    }
  }

  var global_endpoints = [];

  var connected_endpoints = [];
  io.sockets.on('connection', function(socket) {
    console.log("Got socket.io connection")

    var endpoints = createEndpoints(socket);
    connected_endpoints.push(endpoints);
    endpoints.emitter.on('end',function() {
      console.log("removing endpoints");
      connected_endpoints = connected_endpoints.without(endpoints);
    })
  })

  function lastConnected() {
      if(connected_endpoints.length == 0) {
        return null;
      } else {
        return connected_endpoints[connected_endpoints.length-1];
      }    
  }

  function createRemoteConnection(port, address, ready) {
    var ep = lastConnected();
    var emitter = new events.EventEmitter;
    emitter.on('connected',ready);

    function shutdown() {
      emitter.emit('end');
      emitter.removeAllListeners();
    }

    if(!ep) {
      process.nextTick(function() {
        emitter.emit('error');
        shutdown();
      });
    }

  }

  return {
    // Define a global endpoint creator that
    // is associated with all connected sockets
    createRemoteConnection: createRemoteConnection,
  }
}
