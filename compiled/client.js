function check_ping(){last_ping=Date.now();if(tunnel_connected)return;tunnel_connected=!0;if(!tunnel_command)return;var e=require("child_process"),t=e.exec(tunnel_command),n=setInterval(function(){Date.now()-last_ping>1e4&&(tunnel_connected=!1,t.kill(),clearInterval(n))},1e3)}var common=require("./common"),net=require("net"),argv=require("optimist")["default"]({p:3e3,e:null}).demand("s").argv,server=common.newServer(argv.p,[["/serveraddress",argv.s]]),tunnel_command=argv.e,tunnel_connected=!1,last_ping=0;server.newEndpoint("p",function(){check_ping()});var netserver=net.createServer(function(e){function t(t){function r(t){e.write(new Buffer(t.d,"binary"))}e.on("data",function(e){e&&e.length>0&&server.sendMessage({c:t.i,d:e.toString("binary")})}),e.on("end",function(){server.sendMessage({c:"x",i:t.i}),n.close()}),n.setCallback(r)}var n=server.newEndpoint(null,t,function(){e.close()});server.sendMessage({c:"open",i:n.id})});netserver.listen(12345,"127.0.0.1");