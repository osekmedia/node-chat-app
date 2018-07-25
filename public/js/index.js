var socket = io();

socket.on('connect', function() {
	console.log('connected to server');

});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {

	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery("#message-template").html();

	var html = Mustache.render( template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);

});

socket.on('newLocationMessage', function(message) {

	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery("#location-message-template").html();

	var html = Mustache.render( template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);

});

jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	var messageBox = jQuery('input[name=message]', jQuery(this));
	socket.emit('createMessage', {
		from: 'User',
		text: messageBox.val()
	}, function(){
		messageBox.val("");
	});
});

var locationButton = jQuery('#send-location');

locationButton.on( 'click', function(){

	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled' ).text("Sending Location..");
	//Geolocation api
	//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
	navigator.geolocation.getCurrentPosition(function(position){
		locationButton.removeAttr('disabled').text("Send Location");
		socket.emit('createLocationMessage', { 
			latitude: position.coords.latitude, 
			longitude: position.coords.longitude
		} );
	}, function(){
		alert('Unable to fetch location');
		locationButton.removeAttr('disabled').text("Send Location");
	} );

});

