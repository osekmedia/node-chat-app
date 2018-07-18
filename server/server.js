const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join( __dirname, '../public' );
const port = process.env.PORT || 3000;
const app = express();

var server = http.createServer( app );
var io = socketIO( server );

app.use( express.static( publicPath ) ); 

io.on('connection', (socket) => {
	console.log('New user connected');


	socket.emit('newMessage', {
		from: 'Erin',
		text: 'My new message text',
		createdAt: 1234
	});

	socket.on('createMessage', (message)=>{
		console.log('Create Message', message);
	});

	socket.on('disconnect', ()=>{
		console.log('User was disconnected!');
	});
});


server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
