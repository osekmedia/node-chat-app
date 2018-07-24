const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join( __dirname, '../public' );
const port = process.env.PORT || 3000;
const app = express();


var server = http.createServer( app );
var io = socketIO( server );

app.use( express.static( publicPath ) ); 

io.on('connection', (socket) => {
	console.log('New user connected');

	//Send user welcome message
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	//Alert other users a new user joined
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined the chat'));

	socket.on('createMessage', (message, callback)=>{
		//Send message to everyone
		io.emit('newMessage', generateMessage(message.from, message.text));

		//Send acknowledgment to caller 
		callback('This is from the server');

	});

	socket.on('createLocationMessage', (coords) => {
		//Send location to al users
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', ()=>{
		console.log('User was disconnected!');
	});
});


server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
