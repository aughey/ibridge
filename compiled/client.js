var common=require("./common"),net=require("net"),argv=require("optimist")["default"]({p:3E3,e:null}).argv,server=common.newServer(argv.p),tunnel_command=argv.e,tunnel_connected=!1,last_ping=0;function check_ping(){last_ping=Date.now();if(!tunnel_connected&&(tunnel_connected=!0,tunnel_command))var a=require("child_process").exec(tunnel_command),b=setInterval(function(){1E4<Date.now()-last_ping&&(tunnel_connected=!1,a.kill(),clearInterval(b))},1E3)}server.newEndpoint("p",function(){check_ping()});
var netserver=net.createServer(function(a){var b=server.newEndpoint(null,function(c){a.on("data",function(a){a&&0<a.length&&server.sendMessage({c:c.i,d:a.toString("binary")})});a.on("end",function(){server.sendMessage({c:"x",i:c.i});b.close()});b.setCallback(function(b){a.write(new Buffer(b.d,"binary"))})},function(){a.close()});server.sendMessage({c:"open",i:b.id})});netserver.listen(12345,"127.0.0.1");
