const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join( __dirname, '../public' );
const port = process.env.PORT || 3000;
const app = express();


var server = http.createServer( app );
var io = socketIO( server );
var users = new Users();

//Set path to public files
app.use( express.static( publicPath ) ); 

//Socket connected to browser/client
io.on('connection', (socket) => {

	console.log('New user connected');

	//User joined a room
	socket.on( 'join', ( params, callback ) => {

		if( !isRealString(params.name) || !isRealString(params.room) ){
			return callback( 'Name and room name are required' );
		}

		//Limit socket to specific room
		socket.join( params.room );

		//Remove user from user list to eliminate any duplicates
		users.removeUser(socket.id);

		//Add user to user list
		users.addUser(socket.id, params.name, params.room );

		//Send user list to all members of room
		io.to(params.room).emit('updateUserList', users.getUserList( params.room ) );
		//socket.leave(params.room);

		//io.emit -> io.to(params.room).emit - send message to all room memebers
		//socket.broadcast.emit -> socket.broadcast.to(params.room).emit -- send to all users execpt socket owner
		//socket.emit -> send message to socket owner

		//Send welcome message to new user
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

		//Send message to other users in group
		socket.broadcast.to( params.room ).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room`));

		callback();

	});

	socket.on('createMessage', (message, callback)=>{

		//Get user from list of active users
		var user = users.getUser(socket.id);

		//Validate message
		if( user && isRealString(message.text) ){
			//Send message to everyone in room
			io.to( user.room ).emit( 'newMessage', generateMessage( user.name, message.text ) );
		}

		//Send acknowledgment to caller 
		callback();

	});

	socket.on('createLocationMessage', (coords) => {

		//Get user from list of active users
		var user = users.getUser(socket.id);

		//if the user is found, send their geo info
		if( user ){
			//Send location to al users
			io.to( user.room ).emit( 'newLocationMessage', generateLocationMessage( user.name, coords.latitude, coords.longitude ) );
		}
		
	});

	socket.on('disconnect', ()=>{

		//Remove user from active user list
		var user = users.removeUser(socket.id);

		//If user was found remove them from the list of users on the client and let other users know they left
		if(user){
			io.to( user.room ).emit('updateUserList', users.getUserList( user.room ) );
			io.to( user.room ).emit('newMessage', generateMessage('Admin',`${user.name} has left the room`) );
		}
		console.log('User was disconnected!');
	});
});


server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
