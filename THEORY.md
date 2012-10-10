# Theory of Operation

> The explaination below uses the smart phone tethering use case
> to explain the operation and use of the software.

iBridge has 3 components.  The server that resides on a computer
accessible on the public Internet.  A client that runs on your
laptop/desktop.  And a middle-man web application that runs on your 
smart phone device.

The network picture looks like.

       (isolated)     Ad Hoc                  Internet
    Laptop/Desktop <----------> Smart Phone <----------> Server

Your laptop connects to the smart phone using an ad hoc wireless network.
The smart phone is connected to the public Internet using 3G or similar
cellular technologies, and is also connected to the laptop over the
ad hoc network.  The phone is dual-homed meaning it is connected to
two networks at the same time.

      (isolated)      Ad Hoc                  Internet
    Laptop/Desktop <----------> Smart Phone <----------> Server
      [node.js] <--Web Socket--> [Safari] <--Web Socket--> [node.js]

The software layer is shown above.  On the laptop/desktop there is a
node.js server running that is connected via web sockets to a javascript
program running in the native Safari/Chrome/Whatever web browser on the 
phone.  The phone is also connected to the server over the same web
sockets protocol.  The phone simply passes data from one side of the
network to the other side and vice versa.

Once connected, data can flow between the isolated laptop/desktop computer
and the server through the smart phone.

Using this data path, the software forwards a network port from the
laptop/desktop to the ssh port on the server so that a secure ssh
connection can be made between the laptop/desktop and the server.  The
ssh client has built-in support for a SOCKS server, through which
additional connections can be routed.  Modern web browsers can be configured
to use this SOCKS server as a proxy.

It's possible to build a http proxy service directly into the node.js servers.
This might be appropriate to allow a computer without an ssh server (Windows)
to act as the server.  Currently, as a proof of concept, only ssh tunneling
is provided.
