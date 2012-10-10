# iBridge - Bridge two networks with a web browser

## Summary

iBridge uses a web browser to bridge together two networks
without the need for operating system support.  One use case
for this software is to use a smart phone device to temporarily
tether a desktop computer to the internet.  Another use case is
to tunnel through a proxy server to access the public internet.
This can all be done without jail-breaking a device or administrative
access to a computer.

> Note: Be sure to follow usage policies on your respective networks.

## Requirements

> The explaination below uses the smart phone tethering use case
> to explain the operation and use of the software.  The requirements
> are similar for other use cases.

iBridge requires three devices.  A server computer on the public Internet.
A client computer that you wish to connect to the public Internet.  And
a smart phone device.

The public Internet computer can be any computer capable of running the
node.js executable.  This computer must be accessible by the smart phone
over the phone's cellular network.

The client computer also needs to be capable of running the node.js executable.
Additionally, this computer must be able to create an adhoc wireless network
with the smart phone.  Some corporate configurations disallow this, but any
home computer should provide this capability.  The procedure for creating
this network will be different from operating system to operating system.

The smart phone must be able to connect to the client computer using the
adhoc wireless network, and be able to connect to the server computer over
the public Internet.

## Procedure

1. Run the server application on the server computer by running 'node server.js -o'
2. Create an adhoc wireless network on your client computer.
3. Connect the smart phone to this wireless network.
4. Run the client application on the client computer by running 'node socks-client.js -s http://SERVER_INTERNET_ADDRESS:3001'
5. Open up the web browser on the phone and connect to http://CLIENT_ADHOC_NETWORK_ADDRESS:3000
6. Configure your web browser to use a SOCKS proxy on port 8888.

Steps 2, 5, and 6 will require some work to determine the proper procedure for your
environment.  Some guidance is available below.

### Adhoc wireless network.

Do a google search for a procedure for your operating system.  It's not hard,
but may take some research.  One issue I've had is the IP addressing not being automaticly assigned.
I recommend using a static IP address on both the client computer and the smart phone.  This is important for step 5.

### Finding the client adhoc network address

If you configure static IP addresses for the client computer and smart phone as
I recommend above, you will know the address.  And it will always be the same.

### SOCKS proxy configuration

> taken from http://www.supportforums.net/showthread.php?tid=15852

#### Steps to configure Firefox, to use proxy/socks server:

1 Open your Firefox. Click Tools > Options > Advanced > Network.
2 Under the "Connection," select the "Settings" button.
3 Check the box marked "Manual proxy configuration." Enter your proxy IP and port information into the spaces provided.
4 Select the option "Use this Proxy Server for all Protocols" if you wish to use your SOCKS proxy to establish HTTP, SSL and Gopher connections, or to manually enter any proxies for those options.
5 Click "OK" two times to exit the Options window. You may now use Firefox to browse the web over your SOCKS proxy.

#### Steps to configure the Internet Explorer, to use proxy/socks server:

1 Open Internet Explorer (IE). Click Tools > Internet Options.
2 Click the "Connections tab. Under the Local Area Network (LAN) Settings section, click the button named "LAN Settings."
3 In the Proxy Server section, check the box "Use a proxy server for your LAN".
4 Enter your SOCKS proxy address and port. Use the Advanced options to modify advanced settings, if necessary. Most users will not need to change the advanced settings.
5 Click "OK" two times to exit the Internet Options window. You may now use Internet Explorer to browse the web over your SOCKS proxy.

#### Steps to configure Chrome web browser to use proxy/socks server:

1 Click on the wrench icon at the top right corner of the Chrome window.
2 Choose "Options" from the drop down menu.
3 Click on the "Under the Hood" tab, then click on "Change proxy settings" under the Network heading.
4 Click on "LAN settings" under the Local Area Network (LAN) settings.
5 Check the box that reads "Use a proxy server for your LAN (These settings will not apply to dial-up or VPN connections)" and enter the server's details in the boxes below. Finally, click the "OK" button.

#### Steps to configure Opera web browser to use proxy/socks server:

1 Opera browser and go the "Tools" menu at the top navigation bar. Click on Preferences.
2 Go to "Advanced" tab. At the left hand side you will see a bunch of configuration options. Click on the Network. It should be something very similar to the picture below. Once you are on the Network Setting the fist button at the top will say Proxy Servers. Click on that button.
3 Now you must enter the IP address or your Proxy Server host. The settings will be saved after you confirm all the windows by clicking OK button. After that they will become active immediately. If the proxy requires a username and password you will be asked to reload.

## Advanced Usage

There is also a client.js application that creates a tunnel to the remote ssh port.
This can be used to establish a more secure connection to the remote computer using
ssh.  The native ssh tunneling can be used to create remote connections.

To use this application, the -o option is unnecessary on the server and I recommend
you do not use it.

On the client side, the -s option is still required.  A -e option is optional and will
be the command that is executed once the tunnel is detected to be operational.  A
recommended -e option is 'ssh -N localhost -D 11111 -p 12345' which will create a local SOCKS
server on port 11111.

This usage is possibly more secure, but levies additional requirements on the server.

## Third Party Software Used

iBridge leverages several third party packages.

* socket.io for websocket handling http://socket.io
* optimist for command line option parsing
* jquery for DOM processing on the browser
* underscore.js for javascript utility functions
* node-socks for native SOCKSv5 handling https://github.com/gvangool/node-socks
* jquery-qrcode for generating qr codes in the ui http://github.com/jeromeetienne/jquery-qrcode

## Theory of Operation

Hard core users can read up on the theory of operation https://github.com/aughey/ibridge/blob/master/THEORY.md
