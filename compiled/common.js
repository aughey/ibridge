exports.newServer=function(e,t){function r(e,r){var i=n.parse(e.url);i.pathname=="/"&&(i.pathname="/index.html");for(var s=0;s<t.length;s++){var u=t[s];if(u[0]==i.pathname){r.writeHead(200),r.end(u[1]);return}}var a=__dirname+"/public"+i.pathname;o.readFile(a,function(e,t){if(e)return r.writeHead(500),r.end("Error serving "+a);r.writeHead(200),r.end(t)})}function f(e,t,n){var r=e;return r||(r=a,a+=1),u[r]=[t,n],{setCallback:function(e){u[r][0]=e},close:function(){delete u[r]},id:r}}function c(e){if(!l)return;l.emit("data",e)}t=t||[];var n=require("url"),i=require("http").createServer(r),s=require("socket.io").listen(i),o=require("fs");i.listen(e),s.set("log level",2);var u={},a=0,l=null;return f("x",function(e){var t=u[e.i];t&&(t[1]&&t[1](),delete u[e.i])}),s.sockets.on("connection",function(e){e.on("data",function(e){var t=u[e.c];t?t[0](e):e.s&&c({c:"x",i:e.s})}),l=e}),{newEndpoint:f,sendMessage:c}};