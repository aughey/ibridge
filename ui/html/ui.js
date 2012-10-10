function ui_event(name, data) {
	if(name != 'address') return;
	//$('#content').append("<div>got ui event " + name + ": " + JSON.stringify(data) + "</div>");
	var url = "http://" + data.addresses[data.addresses.length - 1] + ":3000";
	$('#qrcode').qrcode(url);
	$('#content').html("<p>Go to " + url + " on your smart phone's web browser.  Or simply scan the QRCode below.</p>")
}

function init() {}

$(init);