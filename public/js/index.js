var socket = io();

socket.on('connect', function() {
	console.log('connected to server');

});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {

	console.log('New message', message);

	var formattedTime = moment(message.createdAt).format('h:mm a');

	var li = jQuery('<li></li>');

	li.text(`${message.from} ${formattedTime}: ${message.text}`);

	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {

	var formattedTime = moment(message.createdAt).format('h:mm a');

	console.log('New location message', message);
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');
	li.text(`${message.from} ${formattedTime}: `);
	a.attr('href', message.url );
	li.append(a);
	jQuery('#messages').append(li);

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

