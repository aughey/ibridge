exports.newServer=function(k){function h(a,b,d){var c=a;c||(c=f,f+=1);e[c]=[b,d];return{setCallback:function(b){e[c][0]=b},close:function(){delete e[c]},id:c}}var l=require("url"),i=require("http").createServer(function(a,b){var d=l.parse(a.url);"/"==d.pathname&&(d.pathname="/index.html");var c=__dirname+"/public"+d.pathname;m.readFile(c,function(a,d){if(a)return b.writeHead(500),b.end("Error serving "+c);b.writeHead(200);b.end(d)})}),j=require("socket.io").listen(i),m=require("fs");i.listen(k);j.set("log level",
2);var e={},f=0,g=null;h("x",function(a){var b=e[a.i];if(b){if(b[1])b[1]();delete e[a.i]}});j.sockets.on("connection",function(a){a.on("data",function(b){var a=e[b.c];if(a)a[0](b)});g=a});return{newEndpoint:h,sendMessage:function(a){g&&g.emit("data",a)}}};
