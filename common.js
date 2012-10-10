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


  var endpoints = {}
  var endpointindex = 0;

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
      id: thisindex

    }
  }

  var g_socket = null;

  function sendMessage(msg) {
    if(!g_socket) {
      return;
    }
    g_socket.emit('data', msg);
  }

  newEndpoint('x', function(d) {
    var ep = endpoints[d.i];
    if(ep) {
      if(ep[1])
        ep[1]();
      delete endpoints[d.i];
    }
  });

  

  io.sockets.on('connection', function(socket) {
    console.log("Got socket.io connection")
    
    socket.on('data', function(data) {
      var handler = endpoints[data['c']];
      if(!handler) {
        if(data['s']) {
          // Tell that remote connection to disconnect
          sendMessage({c: 'x', i: data['s']})
        }
      } else {
        handler[0](data);
      }
    });
    g_socket = socket;
  })

  return {
    newEndpoint: newEndpoint,
    sendMessage: sendMessage
  }
}
