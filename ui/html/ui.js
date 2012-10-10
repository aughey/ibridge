function ui_event(name,data) {
	if(name != 'address')
		return;
	//$('#content').append("<div>got ui event " + name + ": " + JSON.stringify(data) + "</div>");
	if(data.interface == 'en1') {
		$('#qrcode').qrcode("http://" + data.addresses[data.addresses.length-1] + ":3000");
	}
}

function init() {
}

$(init);