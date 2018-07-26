var socket = io();


function scrollToBottom(){

	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');

	//heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ){
		messages.scrollTop( scrollHeight );
	}

}

socket.on('connect', function() {
	console.log('connected to server');
	var params = jQuery.deparam( window.location.search );
	socket.emit( 'join', params, function( error ){

		if( error ){
			alert( error );
			window.location.href = '/';
		} else {
			console.log('No Errors!');
		}

	} );
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){

	var ol = jQuery('<ol></ol>');

	users.forEach( function(user){
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);

	console.log( 'users list: ', users );

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

	scrollToBottom();

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

	scrollToBottom();

});

jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	var messageBox = jQuery('input[name=message]', jQuery(this));
	socket.emit('createMessage', {
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

