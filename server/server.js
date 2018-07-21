const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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
		console.log('Create Message:', message );
		//Send message to everyone
		io.emit('newMessage', generateMessage(message.from, message.text));

		//Send acknowledgment to caller 
		callback('This is from the server');
		//Message to all users except sender by using socket/broadcast
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });

	});

	socket.on('disconnect', ()=>{
		console.log('User was disconnected!');
	});
});


server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
